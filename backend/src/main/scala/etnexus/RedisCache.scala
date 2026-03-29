package etnexus

import io.lettuce.core.{RedisClient => LettuceRedisClient}
import io.lettuce.core.api.StatefulRedisConnection
import io.lettuce.core.api.async.RedisAsyncCommands
import com.typesafe.config.ConfigFactory
import com.typesafe.scalalogging.LazyLogging

import scala.concurrent.{Future, ExecutionContext, Promise}
import scala.util.Try

/** Thin Scala wrapper around Lettuce's async Redis commands. Uses Promise-based
  * bridging (Java 8 compatible) to stay non-blocking.
  */
object RedisCache extends LazyLogging {

  private val config = ConfigFactory.load().getConfig("etnexus.redis")
  private val host = config.getString("host")
  private val port = config.getInt("port")
  val ttlSeconds: Long = config.getLong("ttl-seconds")

  // Single shared connection (thread-safe in Lettuce)
  private lazy val client: LettuceRedisClient =
    LettuceRedisClient.create(s"redis://$host:$port")
  private lazy val conn: StatefulRedisConnection[String, String] =
    client.connect()
  private lazy val async: RedisAsyncCommands[String, String] = conn.async()

  /** Bridge a Lettuce RedisFuture to a Scala Future via a Promise */
  private def toFuture[A](
      redisFuture: io.lettuce.core.RedisFuture[A]
  )(implicit ec: ExecutionContext): Future[A] = {
    val p = Promise[A]()
    redisFuture.whenComplete { (result, ex) =>
      if (ex != null) p.failure(ex)
      else p.success(result)
    }
    p.future
  }

  /** Retrieve a value by key. Returns None if key is missing or Redis is down.
    */
  def get(key: String)(implicit ec: ExecutionContext): Future[Option[String]] =
    toFuture(async.get(key))
      .map(Option(_))
      .recover { case ex =>
        logger.warn(s"Redis GET failed for key=$key: ${ex.getMessage}")
        None
      }

  /** Set a key with TTL (seconds). Errors are logged but don't fail the
    * request.
    */
  def setEx(key: String, value: String)(implicit
      ec: ExecutionContext
  ): Future[Unit] =
    toFuture(async.setex(key, ttlSeconds, value))
      .map(_ => ())
      .recover { case ex =>
        logger.warn(s"Redis SETEX failed for key=$key: ${ex.getMessage}")
      }

  /** Graceful shutdown called from Server shutdown hook */
  def close(): Unit = Try {
    conn.close()
    client.shutdown()
  }.recover { case ex =>
    logger.warn(s"Redis shutdown error: ${ex.getMessage}")
  }
}

package etnexus

import io.lettuce.core.RedisClient
import io.lettuce.core.api.StatefulRedisConnection
import io.lettuce.core.api.async.RedisAsyncCommands
import com.typesafe.config.ConfigFactory
import com.typesafe.scalalogging.LazyLogging

import scala.concurrent.{Future, ExecutionContext}
import scala.jdk.FutureConverters._

/** Thin Scala wrapper around Lettuce's async Redis commands. All methods return
  * Scala Futures — never block the Akka dispatcher.
  */
object RedisCache extends LazyLogging {

  private val config = ConfigFactory.load().getConfig("etnexus.redis")
  private val host = config.getString("host")
  private val port = config.getInt("port")
  val ttlSeconds: Long = config.getLong("ttl-seconds")

  // Single shared connection (thread-safe in Lettuce)
  private lazy val client: RedisClient =
    RedisClient.create(s"redis://$host:$port")
  private lazy val conn: StatefulRedisConnection[String, String] =
    client.connect()
  private lazy val async: RedisAsyncCommands[String, String] = conn.async()

  /** Retrieve a value by key. Returns None if key is missing. */
  def get(key: String)(implicit ec: ExecutionContext): Future[Option[String]] =
    async.get(key).toScala.map(Option(_)).recover { case ex =>
      logger.warn(s"Redis GET failed for key=$key: ${ex.getMessage}")
      None
    }

  /** Set a key with TTL (seconds). Fire-and-forget — errors are logged. */
  def setEx(key: String, value: String)(implicit
      ec: ExecutionContext
  ): Future[Unit] =
    async.setex(key, ttlSeconds, value).toScala.map(_ => ()).recover {
      case ex =>
        logger.warn(s"Redis SETEX failed for key=$key: ${ex.getMessage}")
    }

  /** Graceful shutdown */
  def close(): Unit = {
    conn.close()
    client.shutdown()
  }
}

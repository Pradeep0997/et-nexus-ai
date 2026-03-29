package etnexus

import akka.actor.typed.ActorSystem
import akka.actor.typed.scaladsl.Behaviors
import akka.http.scaladsl.Http
import akka.http.scaladsl.server.Directives._
import com.typesafe.scalalogging.LazyLogging

import scala.concurrent.{Await, ExecutionContext, Promise}
import scala.concurrent.duration.Duration
import scala.util.{Failure, Success}

object Server extends LazyLogging {

  def main(args: Array[String]): Unit = {
    implicit val system: ActorSystem[Nothing] =
      ActorSystem(Behaviors.empty, "et-nexus-system")

    implicit val ec: ExecutionContext = system.executionContext

    val host = sys.env.getOrElse("HOST", "0.0.0.0")
    val port = sys.env.get("PORT").flatMap(_.toIntOption).getOrElse(8080)

    // CORS headers for local Vite dev server (port 5173)
    val corsRoute = respondWithHeaders(
      akka.http.scaladsl.model.headers
        .RawHeader("Access-Control-Allow-Origin", "*"),
      akka.http.scaladsl.model.headers
        .RawHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS"),
      akka.http.scaladsl.model.headers.RawHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
      )
    ) {
      options { complete("") } ~ Routes.all
    }

    val bindingFuture = Http().newServerAt(host, port).bind(corsRoute)

    bindingFuture.onComplete {
      case Success(binding) =>
        val addr = binding.localAddress
        logger.info(
          s"""
             |╔══════════════════════════════════════════════════╗
             |║   ET Nexus API Gateway — ONLINE                  ║
             |║   http://${addr.getHostString}:${addr.getPort}/api/health         ║
             |║   http://${addr.getHostString}:${addr.getPort}/api/briefing?topic=rbi ║
             |╚══════════════════════════════════════════════════╝""".stripMargin
        )
        sys.addShutdownHook {
          RedisCache.close()
          binding.unbind().onComplete(_ => system.terminate())
        }
      case Failure(ex) =>
        logger.error(s"Server failed to bind to $host:$port — ${ex.getMessage}")
        system.terminate()
    }

    // ── Block main thread forever so sbt run / nohup keeps the JVM alive ─────
    // Akka HTTP bind is async — without this the main thread exits immediately.
    Await.ready(Promise[Nothing]().future, Duration.Inf)
  }
}

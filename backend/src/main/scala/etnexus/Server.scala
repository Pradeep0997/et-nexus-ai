package etnexus

import akka.actor.typed.ActorSystem
import akka.actor.typed.scaladsl.Behaviors
import akka.http.scaladsl.Http
import akka.http.scaladsl.model._
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import com.typesafe.scalalogging.LazyLogging
import io.circe.generic.auto._
import io.circe.syntax._
import de.heikoseeberger.akkahttpcirce.FailFastCirceSupport._

import scala.concurrent.ExecutionContext
import scala.util.{Failure, Success}

// ── Domain models ─────────────────────────────────────────────────────────────
case class HealthResponse(status: String, service: String, version: String)

// ── Main Server ───────────────────────────────────────────────────────────────
object Server extends LazyLogging {

  /** All HTTP routes wired together */
  def routes(implicit ec: ExecutionContext): Route = {
    pathPrefix("api") {
      concat(
        // GET /api/health
        (path("health") & get) {
          val response = HealthResponse(
            status  = "UP",
            service = "ET Nexus API",
            version = "0.1.0"
          )
          complete(StatusCodes.OK -> response)
        },

        // GET /api/ping (quick latency check for demo)
        (path("ping") & get) {
          complete(StatusCodes.OK -> Map("message" -> "pong"))
        }
      )
    }
  }

  def main(args: Array[String]): Unit = {
    // Typed actor system — guardian behaviour does nothing (HTTP only)
    implicit val system: ActorSystem[Nothing] =
      ActorSystem(Behaviors.empty, "et-nexus-system")

    implicit val ec: ExecutionContext = system.executionContext

    val host = sys.env.getOrElse("HOST", "0.0.0.0")
    val port = sys.env.get("PORT").flatMap(_.toIntOption).getOrElse(8080)

    val bindingFuture = Http().newServerAt(host, port).bind(routes)

    bindingFuture.onComplete {
      case Success(binding) =>
        val address = binding.localAddress
        logger.info(
          s"""
             |╔══════════════════════════════════════════╗
             |║   ET Nexus API Gateway — ONLINE          ║
             |║   http://${address.getHostString}:${address.getPort}/api/health
             |╚══════════════════════════════════════════╝
             |""".stripMargin
        )
      case Failure(ex) =>
        logger.error(s"Server failed to bind to $host:$port — ${ex.getMessage}")
        system.terminate()
    }
  }
}

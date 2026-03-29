package etnexus

import akka.http.scaladsl.model.StatusCodes
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import com.typesafe.scalalogging.LazyLogging
import de.heikoseeberger.akkahttpcirce.FailFastCirceSupport._
import io.circe.generic.auto._
import io.circe.syntax._
import io.circe.parser._

import scala.concurrent.{ExecutionContext, Future}

// ── Domain models (strict JSON contracts) ─────────────────────────────────────

case class TimelineEvent(
    date: String,
    title: String,
    description: String,
    sentiment: String // "positive" | "negative" | "neutral"
)

case class KeyPlayer(
    name: String,
    role: String,
    impact: String // "high" | "medium" | "low"
)

case class BriefingResponse(
    topic: String,
    summary: String,
    timeline_events: List[TimelineEvent],
    key_players: List[KeyPlayer],
    cached: Boolean
)

// ── Mock briefing factory ─────────────────────────────────────────────────────
object MockBriefings {

  private val rbi = BriefingResponse(
    topic = "rbi-rate-decision",
    summary =
      """The Reserve Bank of India held the benchmark repo rate at 6.50% for the seventh consecutive
        |meeting in a row. The Monetary Policy Committee voted 5-1, with one member dissenting in
        |favour of a 25 bps cut. Governor Das cited sticky core CPI at 4.9% and food price volatility
        |as the primary reasons for the pause. Bond markets rallied marginally while the rupee
        |strengthened 18 paise to 83.29 against the dollar on benign FII inflows.""".stripMargin,
    timeline_events = List(
      TimelineEvent(
        "Feb 2023",
        "Rate Hiking Cycle Begins",
        "RBI kicks off 250 bps hike cycle to combat post-pandemic inflation",
        "negative"
      ),
      TimelineEvent(
        "Apr 2023",
        "Repo Hits 6.50%",
        "RBI reaches terminal rate of 6.50%; signalling peak of cycle",
        "neutral"
      ),
      TimelineEvent(
        "Oct 2023",
        "Pause Mode Begins",
        "MPC unanimously votes to hold — prioritising growth while watching CPI",
        "neutral"
      ),
      TimelineEvent(
        "Jun 2024",
        "CPI Eases to 4.75%",
        "Headline inflation finally within tolerance band; market expects imminent cut",
        "positive"
      ),
      TimelineEvent(
        "Aug 2024",
        "Food Inflation Spikes",
        "Vegetable prices surge 25% YoY; MPC delays expected cut for 2nd time",
        "negative"
      ),
      TimelineEvent(
        "Mar 2025",
        "7th Consecutive Hold",
        "Rate held at 6.50%; one dissenting vote signals a cut is now on the table for Q3",
        "neutral"
      )
    ),
    key_players = List(
      KeyPlayer("Shaktikanta Das", "RBI Governor", "high"),
      KeyPlayer("MPC Committee", "Rate Setting Body", "high"),
      KeyPlayer("Shashanka Bhide", "MPC External Member", "medium"),
      KeyPlayer("Finance Ministry", "Fiscal Partner", "medium"),
      KeyPlayer("FII Desk", "Market Participant", "low")
    ),
    cached = false
  )

  private val quickComm = BriefingResponse(
    topic = "quick-commerce",
    summary = """India's quick commerce sector crossed a critical inflection point this week as Zepto raised
        |$350M at a $5B valuation — the largest single round in the space. Blinkit (Zomato) and Swiggy
        |Instamart responded with aggressive dark store expansion plans in Tier-2 cities. The category
        |is expected to hit $6B GMV by 2027 as 10-minute delivery becomes the default consumer expectation.""".stripMargin,
    timeline_events = List(
      TimelineEvent(
        "2020 Q4",
        "Zepto Founded",
        "Aadit Palicha and Kaivalya Vohra pivot to 10-min grocery delivery model",
        "positive"
      ),
      TimelineEvent(
        "2021 Q3",
        "Blinkit (Grofers) Pivots",
        "Grofers rebrands to Blinkit; races to deploy dark store network",
        "neutral"
      ),
      TimelineEvent(
        "2022 Q2",
        "Zomato Acquires Blinkit",
        "Zomato buys Blinkit for $569M — instant credibility & distribution",
        "positive"
      ),
      TimelineEvent(
        "2023 Q1",
        "Swiggy Instamart Scales",
        "Swiggy Instamart crosses 500 dark stores; total industry burns ₹3200 Cr/quarter",
        "negative"
      ),
      TimelineEvent(
        "2024 Q3",
        "Profitability Push",
        "Blinkit turns EBITDA positive; investors demand path to profitability from Zepto",
        "positive"
      ),
      TimelineEvent(
        "2025 Q1",
        "Zepto $350M Raise",
        "Zepto raises at $5B valuation; plans 1000 dark stores by Dec 2025",
        "positive"
      )
    ),
    key_players = List(
      KeyPlayer("Aadit Palicha", "Zepto CEO & Co-Founder", "high"),
      KeyPlayer("Albinder Dhindsa", "Blinkit CEO", "high"),
      KeyPlayer("Instamart Team", "Swiggy Quick Commerce", "high"),
      KeyPlayer("Deepinder Goyal", "Zomato CEO", "medium"),
      KeyPlayer("Tiger Global", "Lead Investor", "medium")
    ),
    cached = false
  )

  private val default = BriefingResponse(
    topic = "india-economy",
    summary =
      """India's macro picture remains broadly positive: GDP growth is tracking 8.4% for FY24,
        |fiscal deficit is contained at 5.1% of GDP, and export momentum is building in electronics
        |and pharmaceuticals. The primary near-term risks are monsoon variability and a potential
        |El Niño impact on food inflation, which could delay the rate-cut cycle further.""".stripMargin,
    timeline_events = List(
      TimelineEvent(
        "Apr 2024",
        "FY25 Starts Strong",
        "Q1 GDP prints at 7.8%; government capex pushes infrastructure spend",
        "positive"
      ),
      TimelineEvent(
        "Jul 2024",
        "Budget 2024",
        "FM Sitharaman presents ₹48.2L Cr budget; capex at all time high of ₹11.1L Cr",
        "positive"
      ),
      TimelineEvent(
        "Oct 2024",
        "IMF Upgrades India",
        "IMF raises India's FY25 growth forecast to 7.0% — fastest among G20",
        "positive"
      ),
      TimelineEvent(
        "Jan 2025",
        "Interim Budget",
        "No major fiscal surprises; focus on continuity and rural and infra spending",
        "neutral"
      ),
      TimelineEvent(
        "Mar 2025",
        "Q3 GDP at 8.4%",
        "Third quarter beat consensus at 8.4%; private consumption surprise to upside",
        "positive"
      )
    ),
    key_players = List(
      KeyPlayer("Nirmala Sitharaman", "Finance Minister", "high"),
      KeyPlayer("RBI MPC", "Monetary Authority", "high"),
      KeyPlayer("CSO", "GDP Data Publisher", "medium"),
      KeyPlayer("IMF", "Global Forecaster", "medium")
    ),
    cached = false
  )

  val all: Map[String, BriefingResponse] = Map(
    "rbi" -> rbi,
    "rbi-rate" -> rbi,
    "rbi-rate-decision" -> rbi,
    "quick-commerce" -> quickComm,
    "zepto" -> quickComm,
    "default" -> default
  )

  def forTopic(topic: String): BriefingResponse =
    all.getOrElse(topic.toLowerCase.trim, default.copy(topic = topic))
}

// ── Routes ────────────────────────────────────────────────────────────────────
object Routes extends LazyLogging {

  private val CACHE_PREFIX = "briefing:"

  def all(implicit ec: ExecutionContext): Route = {
    pathPrefix("api") {
      concat(
        // ── GET /api/health ───────────────────────────────────
        (path("health") & get) {
          complete(
            StatusCodes.OK -> Map(
              "status" -> "UP",
              "service" -> "ET Nexus API",
              "version" -> "0.1.0"
            )
          )
        },

        // ── GET /api/ping ──────────────────────────────────────
        (path("ping") & get) {
          complete(StatusCodes.OK -> Map("message" -> "pong"))
        },

        // ── GET /api/briefing?topic=xxx ────────────────────────
        (path("briefing") & get & parameter("topic".withDefault("default"))) {
          topic =>
            val cacheKey = s"$CACHE_PREFIX${topic.toLowerCase.trim}"

            val responseFuture: Future[BriefingResponse] =
              RedisCache.get(cacheKey).flatMap {
                case Some(cachedJson) =>
                  logger.info(s"[Redis HIT] key=$cacheKey")
                  Future.fromTry(
                    decode[BriefingResponse](cachedJson)
                      .map(_.copy(cached = true))
                      .toTry
                  )
                case None =>
                  logger.info(s"[Redis MISS] key=$cacheKey — fetching mock")
                  val briefing = MockBriefings.forTopic(topic)
                  // Store in Redis asynchronously (don't block response)
                  RedisCache.setEx(cacheKey, briefing.asJson.noSpaces)
                  Future.successful(briefing)
              }

            onSuccess(responseFuture) { briefing =>
              val headers =
                if (briefing.cached)
                  List(
                    akka.http.scaladsl.model.headers.RawHeader("X-Cache", "HIT")
                  )
                else
                  List(
                    akka.http.scaladsl.model.headers
                      .RawHeader("X-Cache", "MISS")
                  )

              respondWithHeaders(headers) {
                complete(StatusCodes.OK -> briefing)
              }
            }
        },

        // ── GET /api/topics ────────────────────────────────────
        (path("topics") & get) {
          val topics = MockBriefings.all.keys.toList.distinct
          complete(StatusCodes.OK -> Map("topics" -> topics))
        }
      )
    }
  }
}

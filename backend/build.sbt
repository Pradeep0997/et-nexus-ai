import sbt.Keys._

ThisBuild / scalaVersion     := "2.13.12"
ThisBuild / version          := "0.1.0-SNAPSHOT"
ThisBuild / organization     := "com.etnexus"

val AkkaVersion     = "2.8.5"
val AkkaHttpVersion = "10.5.3"
val SlickVersion    = "3.5.1"
val CirceVersion    = "0.14.6"

lazy val root = (project in file("."))
  .settings(
    name := "et-nexus-backend",
    libraryDependencies ++= Seq(
      // Akka HTTP + Streams
      "com.typesafe.akka" %% "akka-http"            % AkkaHttpVersion,
      "com.typesafe.akka" %% "akka-http-spray-json" % AkkaHttpVersion,
      "com.typesafe.akka" %% "akka-stream"          % AkkaVersion,
      "com.typesafe.akka" %% "akka-actor-typed"     % AkkaVersion,

      // Slick (PostgreSQL ORM)
      "com.typesafe.slick" %% "slick"          % SlickVersion,
      "com.typesafe.slick" %% "slick-hikaricp" % SlickVersion,
      "org.postgresql"      % "postgresql"     % "42.7.3",

      // Lettuce (Redis — Java client, widely used with Scala)
      "io.lettuce"          % "lettuce-core"   % "6.3.1.RELEASE",

      // Circe (JSON)
      "io.circe" %% "circe-core"    % CirceVersion,
      "io.circe" %% "circe-generic" % CirceVersion,
      "io.circe" %% "circe-parser"  % CirceVersion,

      // Akka HTTP <-> Circe bridge
      "de.heikoseeberger" %% "akka-http-circe" % "1.39.2",

      // Logging
      "ch.qos.logback"     % "logback-classic" % "1.4.14",
      "com.typesafe.scala-logging" %% "scala-logging" % "3.9.5",

      // Config
      "com.typesafe" % "config" % "1.4.3",

      // Test
      "com.typesafe.akka" %% "akka-http-testkit"   % AkkaHttpVersion % Test,
      "org.scalatest"     %% "scalatest"            % "3.2.17"        % Test,
      "com.typesafe.akka" %% "akka-stream-testkit"  % AkkaVersion     % Test,
    ),
    // Required for Scala 2.13 + Akka
    scalacOptions ++= Seq(
      "-deprecation",
      "-feature",
      "-unchecked",
      "-encoding", "utf8"
    ),
    assembly / mainClass := Some("etnexus.Server"),
    assembly / assemblyMergeStrategy := {
      case PathList("META-INF", "MANIFEST.MF") => MergeStrategy.discard
      case PathList("META-INF", xs @ _*)       => MergeStrategy.first
      case PathList("reference.conf")          => MergeStrategy.concat
      case _                                   => MergeStrategy.first
    }
  )

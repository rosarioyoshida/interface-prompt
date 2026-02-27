# Stage 1: Build with Maven
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /build

# Download dependencies first — cached as a separate layer
COPY pom.xml .
RUN mvn dependency:go-offline -q

# Build the application (OTEL agent is downloaded via maven-dependency-plugin)
COPY src ./src
RUN mvn clean package -DskipTests -q

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-jammy AS runtime
WORKDIR /app

# app Spring Boot (explicito)
COPY --from=build /build/target/ai-prompt-api-*.jar /app/app.jar

# agente OTEL
COPY --from=build /build/target/opentelemetry-javaagent.jar /opt/opentelemetry-javaagent.jar

ENV JAVA_TOOL_OPTIONS="\
  -javaagent:/opt/opentelemetry-javaagent.jar \
  -XX:MaxRAMPercentage=60.0 \
  -XX:InitialRAMPercentage=30.0 \
  -XX:+UseG1GC \
  -XX:+ExitOnOutOfMemoryError"

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]

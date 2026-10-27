# --- Build Stage ---
FROM maven:3.8.5-openjdk-17-slim AS build
WORKDIR /app

# Copy pom.xml and cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy src and build the package
COPY src ./src
RUN mvn clean package -DskipTests -B

# --- Run Stage ---
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Default heap budget; Render environment settings can override this.
ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=65 -XX:InitialRAMPercentage=20"

# Copy built JAR from build stage
COPY --from=build /app/target/url-shortener-backend-0.0.1-SNAPSHOT.jar app.jar

# Expose backend port
EXPOSE 8080

# Run command
ENTRYPOINT ["java", "-jar", "app.jar"]

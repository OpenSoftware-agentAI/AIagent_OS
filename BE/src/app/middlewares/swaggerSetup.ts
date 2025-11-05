import { swaggerSpec, swaggerUi } from "../../swagger";
import { Express } from "express";

export function setupSwagger(app: Express) {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customSiteTitle: "AI Agent OS API Docs",
      customCss: ".swagger-ui .topbar { display: none }",
      swaggerOptions: { persistAuthorization: true },
    })
  );

  console.log("📚 Swagger UI enabled at /api-docs");
  console.log(
    `   - Swagger UI: http://localhost:${process.env.PORT || 3000}/api-docs`
  );
}

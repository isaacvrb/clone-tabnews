import { version as uuidVesion } from "uuid";
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/users/[username]", () => {
  describe("Anonymous user", () => {
    test("With exact case match", async () => {
      const createdUser = await orchestrator.createUser({
        username: "MesmoCase",
      });

      const response1 = await fetch(
        "http://localhost:3000/api/v1/users/MesmoCase",
      );

      expect(response1.status).toBe(200);

      const response1Body = await response1.json();

      expect(response1Body).toEqual({
        id: response1Body.id,
        username: "MesmoCase",
        email: createdUser.email,
        password: response1Body.password,
        created_at: response1Body.created_at,
        updated_at: response1Body.updated_at,
      });

      expect(uuidVesion(response1Body.id)).toBe(4);
      expect(Date.parse(response1Body.created_at)).not.toBeNaN();
      expect(Date.parse(response1Body.updated_at)).not.toBeNaN();
    });

    test("With case mismatch", async () => {
      const createUser = await orchestrator.createUser({
        username: "CaseDiferente",
      });

      const response = await fetch(
        "http://localhost:3000/api/v1/users/casediferente",
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "CaseDiferente",
        email: createUser.email,
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVesion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
    });

    test("With nonexistent username", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/users/UsuarioInexistente",
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "O username informado não foi encontrado no sistema.",
        action: "Verifique se o username está digitado corretamente.",
        status_code: 404,
      });
    });
  });
});

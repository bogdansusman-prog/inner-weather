package ro.innerweather;

import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.UUID;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

// baza pentru testele de integrare: porneste toata aplicatia pe un PostgreSQL real (Testcontainers)
// si trimite cereri HTTP simulate prin MockMvc, cu tot cu filtrele de securitate
@SpringBootTest
@Import(TestcontainersConfiguration.class)
public abstract class IntegrationTest {

    protected static final String PASSWORD = "parola-de-test-123";

    @Autowired
    private WebApplicationContext context;

    protected MockMvc mvc;

    @BeforeEach
    protected void setUpMockMvc() {
        mvc = MockMvcBuilders.webAppContextSetup(context)
                .apply(springSecurity())
                .build();
    }

    // email diferit la fiecare apel, ca testele sa nu se calce intre ele pe aceeasi baza
    protected String uniqueEmail() {
        return "user-" + UUID.randomUUID() + "@test.ro";
    }

    // inregistreaza un cont USER si intoarce access token-ul
    protected String registerUser(String email) throws Exception {
        String body = mvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name": "Test User", "email": "%s", "password": "%s", "accountType": "USER"}
                                """.formatted(email, PASSWORD)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        return JsonPath.read(body, "$.accessToken");
    }

    protected String bearer(String token) {
        return "Bearer " + token;
    }
}

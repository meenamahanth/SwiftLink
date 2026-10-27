package com.urlshortener.controller;

import com.urlshortener.entity.ShortUrl;
import com.urlshortener.repository.ShortUrlRepository;
import com.urlshortener.security.AuthTokenFilter;
import com.urlshortener.service.ShortUrlService;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;
import java.lang.reflect.Proxy;

class RedirectAndHealthTest {
    private static class RecordingShortUrlService extends ShortUrlService {
        ShortUrl url;
        int increments;
        String requestedCode;
        @Override public ShortUrl getUrlByCodeForRedirect(String code) {
            requestedCode = code;
            return url;
        }
        @Override public void incrementClickCount(ShortUrl clicked) {
            assertSame(url, clicked);
            increments++;
        }
    }

    @Test
    void redirectPreservesDestinationAndClickCount() {
        RecordingShortUrlService service = new RecordingShortUrlService();
        ShortUrl url = ShortUrl.builder().longUrl("https://example.com/path?q=1").build();
        service.url = url;
        RedirectController controller = new RedirectController();
        ReflectionTestUtils.setField(controller, "shortUrlService", service);
        var response = controller.redirectUrl("abc");
        assertEquals(HttpStatus.FOUND, response.getStatusCode());
        assertEquals("https://example.com/path?q=1", response.getHeaders().getLocation().toString());
        assertEquals(1, service.increments);
        assertEquals("abc", service.requestedCode);
    }

    @Test
    void healthDoesNotQueryDatabase() {
        ShortUrlRepository repository = (ShortUrlRepository) Proxy.newProxyInstance(
                ShortUrlRepository.class.getClassLoader(), new Class<?>[]{ShortUrlRepository.class},
                (proxy, method, args) -> { throw new AssertionError("Health queried the database"); });
        var response = new HealthController(repository).appHealth();
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("UP", response.getBody().get("status"));

    }

    @Test
    void healthBypassesTokenProcessingEvenWithAuthorizationHeader() throws Exception {
        AuthTokenFilter filter = new AuthTokenFilter();
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/health");
        request.setServletPath("/api/health");
        request.addHeader("Authorization", "Bearer ignored");
        boolean[] reached = {false};
        filter.doFilter(request, new MockHttpServletResponse(), (req, res) -> reached[0] = true);
        assertTrue(reached[0]);
    }
}

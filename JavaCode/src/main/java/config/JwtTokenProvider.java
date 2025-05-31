package config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtTokenProvider {
    
    // Key cố định trong code - phải có ít nhất 64 ký tự cho HS512
    private final SecretKey SECRET_KEY = Keys.hmacShaKeyFor(
        "MyVerySecureAndLongSecretKeyThatIsAtLeast64CharactersLongForHS512Algorithm2024".getBytes(StandardCharsets.UTF_8)
    );
    
    private final long EXPIRATION_TIME = 86400000; // 24 hours

    public String generateToken(UserDetails userDetails, Integer vaiTro, String hoTen) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("vaiTro", vaiTro);
        claims.put("hoTen", hoTen); // Assuming hoTen is the username for simplicity

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SECRET_KEY, SignatureAlgorithm.HS512)
                .compact();
    }

    public String getUsernameFromToken(String token) {
        return getClaims(token).getSubject();
    }

    public Integer getVaiTroFromToken(String token) {
        Object vaiTro = getClaims(token).get("vaiTro");
        return (vaiTro instanceof Integer) ? (Integer) vaiTro : Integer.parseInt(vaiTro.toString());
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        try {
            String username = getUsernameFromToken(token);
            return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private boolean isTokenExpired(String token) {
        return getClaims(token).getExpiration().before(new Date());
    }

    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
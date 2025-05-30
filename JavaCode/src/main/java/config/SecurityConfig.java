package config;

import service.TaiKhoanUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final TaiKhoanUserDetailsService taiKhoanUserDetailsService;

    public SecurityConfig(TaiKhoanUserDetailsService taiKhoanUserDetailsService) {
        this.taiKhoanUserDetailsService = taiKhoanUserDetailsService;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/**").permitAll() // <<< Cho phép gọi API không cần đăng nhập
                // .requestMatchers("/api/auth/login", "/api/auth/signup").permitAll()
                // .requestMatchers("/api/taikhoan/**").hasAnyRole("TO_TRUONG", "TO_PHO")
                .anyRequest().authenticated()
            )
            .userDetailsService(taiKhoanUserDetailsService)
            .httpBasic(Customizer.withDefaults());

            

        return http.build();
    }
}

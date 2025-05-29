package config;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import service.TaiKhoanService;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private TaiKhoanService userDetailsService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Tắt CSRF cho frontend gọi API dễ dàng
            .cors(cors -> {}) // Bật CORS (nếu frontend chạy ở domain khác như localhost:3000)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/**").permitAll() // <<< Cho phép gọi API không cần đăng nhập
                .requestMatchers("/", "/login", "/register", "*.css", "*.js", "*.png").permitAll()
                .anyRequest().permitAll()
            )
            .formLogin(form -> form
                .loginPage("/login")
                .usernameParameter("email")
                .passwordParameter("password")
                .defaultSuccessUrl("/", true)
                .permitAll()
            )
            .logout(logout -> logout
                .logoutSuccessUrl("/")
                .permitAll()
            );
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
        authBuilder.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
        return authBuilder.build();
    }

    @Bean
    public CommandLineRunner checkBeans(ApplicationContext ctx) {
        return args -> {
            String[] beans = ctx.getBeanNamesForType(TaiKhoanService.class);
            System.out.println("TaiKhoanService beans: " + Arrays.toString(beans));
        };
    }
}

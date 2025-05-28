package utils;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http.authorizeHttpRequests(auth -> auth.requestMatchers("/", "/Login", "/css/**", "/js/**").permitAll()
				.anyRequest().authenticated())
				.formLogin(form -> form.loginPage("/Login").defaultSuccessUrl("/", true).permitAll())
				.logout(logout -> logout.logoutSuccessUrl("/").permitAll());
		return http.build();
	}

	@Bean
	public UserDetailsService users() {
		UserDetails user = User.withUsername("admin").password("{noop}password") // {noop} means no encoding
				.roles("USER").build();
		return new InMemoryUserDetailsManager(user);
	}

}
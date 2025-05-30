package main;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
// @EnableJpaRepositories
@EnableJpaRepositories(basePackages = "repository")  // Bắt buộc phải có
@EntityScan(basePackages = "model")  
@ComponentScan(basePackages = "controller")
@ComponentScan(basePackages = "config")
@ComponentScan(basePackages = "service")
public class MainApplication {

	public static void main(String[] args) {
		SpringApplication.run(MainApplication.class, args);
	}

}

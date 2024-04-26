package edu.usc.csci310.project;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.jasypt.encryption.pbe.StandardPBEStringEncryptor;
import org.jasypt.encryption.pbe.config.SimpleStringPBEConfig;
import io.github.cdimascio.dotenv.Dotenv;

import java.util.Objects;


@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private final Dotenv dotenv;

    public SecurityConfig() {
        this.dotenv = Dotenv.configure().directory("./site").filename(".env").load();
    }
    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .formLogin().disable()
                .httpBasic().disable()
                .authorizeHttpRequests(authz -> authz.anyRequest().permitAll());
        http.headers().frameOptions().disable();

        return http.build();
    }
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public StandardPBEStringEncryptor textEncryptor() {
        StandardPBEStringEncryptor textEncryptor = new StandardPBEStringEncryptor();
        SimpleStringPBEConfig config = new SimpleStringPBEConfig();
        textEncryptor.setPassword(Objects.requireNonNull(dotenv.get("ENCRYPTION_KEY")));
        textEncryptor.setAlgorithm("PBEWithMD5AndDES");
        config.setSaltGeneratorClassName("org.jasypt.salt.ZeroSaltGenerator");
        textEncryptor.setConfig(config);
        return textEncryptor;
    }
}

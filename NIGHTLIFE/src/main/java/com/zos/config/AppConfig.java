package com.zos.config;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

@Configuration
public class AppConfig {

	@Value("${frontend.url:http://localhost:3000}")
	private String frontendUrl;

	@Autowired
	private OAuth2LoginSuccessHandler oauth2LoginSuccessHandler;

	@Bean
	public SecurityFilterChain securityConfigration(HttpSecurity http) throws Exception {
		List<String> origins = Arrays.asList(
				"http://localhost:3000",
				"http://localhost:3010",
				"http://localhost:4000",
				frontendUrl
		);

		http
				.csrf().disable()
				.cors().configurationSource(request -> {
					CorsConfiguration config = new CorsConfiguration();
					config.setAllowedOrigins(origins);
					config.setAllowedMethods(Collections.singletonList("*"));
					config.setAllowCredentials(true);
					config.setAllowedHeaders(Collections.singletonList("*"));
					config.setExposedHeaders(Arrays.asList("Authorization"));
					config.setMaxAge(3600L);
					return config;
				})
				.and()
				.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
				.and()
				.authorizeHttpRequests()
				.requestMatchers(HttpMethod.POST, "/signup").permitAll()
				.requestMatchers(HttpMethod.GET, "/api").permitAll()
				.requestMatchers("/oauth2/**", "/login/**").permitAll()
				.anyRequest().authenticated()
				.and()
				.oauth2Login(oauth -> oauth
						.successHandler(oauth2LoginSuccessHandler)
						.failureUrl(frontendUrl + "/login?error=true")
				)
				.formLogin()
				.and()
				.httpBasic()
				.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
				.and()
				.addFilterAfter(new JwtGenratorFilter(), BasicAuthenticationFilter.class)
				.addFilterBefore(new JwtValidationFilter(), BasicAuthenticationFilter.class);

		return http.build();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}

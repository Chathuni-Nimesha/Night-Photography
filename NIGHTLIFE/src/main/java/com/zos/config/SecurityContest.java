package com.zos.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

@Component
public class SecurityContest {

	public static String JWT_KEY;
	public static long JWT_EXPIRATION;
	public static final String HEADER = "Authorization";

	@Value("${jwt.secret}")
	private String jwtSecret;

	@Value("${jwt.expiration:86400000}")
	private long jwtExpiration;

	@PostConstruct
	void init() {
		JWT_KEY = jwtSecret;
		JWT_EXPIRATION = jwtExpiration;
	}
}

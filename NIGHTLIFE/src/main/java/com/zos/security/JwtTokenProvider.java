package com.zos.security;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;

import com.zos.config.SecurityContest;
import com.zos.model.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtTokenProvider {
	
	public JwtTokenClaims getClaimsFromToken(String token) {
		SecretKey key= Keys.hmacShaKeyFor(SecurityContest.JWT_KEY.getBytes());
		
	    Claims claims = Jwts.parser()
	            .setSigningKey(key)
	            .parseClaimsJws(token)
	            .getBody();
	    String username= String.valueOf(claims.get("username"));

	    JwtTokenClaims jwtTokenClaims = new JwtTokenClaims();
//	    jwtTokenClaims.setUsername(Long.parseLong(claims.getSubject()));
	    jwtTokenClaims.setUsername(username);

	    return jwtTokenClaims;
	}
	
	public String  generateJwtToken(User user) {
		SecretKey key=Keys.hmacShaKeyFor(SecurityContest.JWT_KEY.getBytes());
		
		String jwt=Jwts.builder()
				.setIssuer("Nightlife")
				.claim("username",user.getEmail())
				.claim("authorities", "ROLE_USER")
				.setIssuedAt(new Date())
				.setExpiration(new Date(new Date().getTime() + SecurityContest.JWT_EXPIRATION))
				.signWith(key).compact();
		
		
		return jwt;
	}


}

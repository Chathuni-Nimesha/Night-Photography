package com.zos;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@Disabled("Requires a live MySQL instance on localhost:3308; not part of the isolated suite")
@SpringBootTest
class CookingHubApplicationTests {

	@Test
	void contextLoads() {
	}

}

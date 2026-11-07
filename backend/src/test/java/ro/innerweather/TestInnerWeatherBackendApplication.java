package ro.innerweather;

import org.springframework.boot.SpringApplication;

public class TestInnerWeatherBackendApplication {

    public static void main(String[] args) {
        SpringApplication.from(InnerWeatherBackendApplication::main).with(TestcontainersConfiguration.class).run(args);
    }

}

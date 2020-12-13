package com.example.demo001.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class Cmd implements CommandLineRunner {
    @Override
    public void run(String... args) throws Exception {
        MySocket5Server.startServer(1080);
    }
}

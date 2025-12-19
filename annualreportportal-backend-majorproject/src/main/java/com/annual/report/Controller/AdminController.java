package com.annual.report.Controller;

import com.annual.report.Service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/login")
@CrossOrigin(origins ="http://localhost:5173")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PostMapping
    public ResponseEntity<String> creteAdmin( @RequestParam String username, @RequestParam String password){

        boolean isValid = adminService.validateAdmin(username, password);
        if (isValid){
            return new ResponseEntity<>("Admin Successfully Registered", HttpStatus.OK);
        }else {

            return new ResponseEntity<>("Invalid Admin Credentials", HttpStatus.UNAUTHORIZED);
        }

    }
}

package com.annual.report.Service.Impl;

import com.annual.report.Entity.Admin;
import com.annual.report.Repository.AdminRepository;
import com.annual.report.Service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Override
    public boolean validateAdmin(String username, String password) {

        Admin byUsername = adminRepository.findByUsername(username);


        return byUsername!= null && byUsername.getPassword().equals(password);
    }
}

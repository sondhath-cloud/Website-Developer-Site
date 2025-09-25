-- ResultsMode App Demo - Database Schema
-- Run this SQL script to create the database tables

-- Create database (uncomment if needed)
-- CREATE DATABASE resultsmode_demo;
-- USE resultsmode_demo;

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    members INT DEFAULT 0,
    coverage INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Team members table
CREATE TABLE IF NOT EXISTS members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    department VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (department) REFERENCES departments(name) ON DELETE CASCADE
);

-- Stakeholders table
CREATE TABLE IF NOT EXISTS stakeholders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    organization VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    influence ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
    interest ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Connection opportunities table
CREATE TABLE IF NOT EXISTS connections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    opportunity VARCHAR(255) NOT NULL,
    stakeholder VARCHAR(255) NOT NULL,
    type ENUM('Business', 'Technical', 'Sales', 'Partnership') DEFAULT 'Business',
    priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
    status ENUM('Planning', 'Active', 'Completed', 'Cancelled') DEFAULT 'Planning',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Change impacts table
CREATE TABLE IF NOT EXISTS impacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    `change` VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    impact_level ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
    risk ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
    mitigation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Strategic plans table
CREATE TABLE IF NOT EXISTS plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type ENUM('Marketing', 'Product', 'HR', 'Finance', 'Operations') DEFAULT 'Operations',
    status ENUM('Planning', 'Active', 'Completed', 'On Hold') DEFAULT 'Planning',
    start_date DATE,
    end_date DATE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Ideas board table
CREATE TABLE IF NOT EXISTS ideas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category ENUM('Technology', 'Process', 'Product', 'Marketing', 'Other') DEFAULT 'Other',
    status ENUM('Submitted', 'Under Review', 'Approved', 'Rejected', 'Planning', 'Implemented') DEFAULT 'Submitted',
    submitted_by VARCHAR(255) NOT NULL,
    priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Job aids table
CREATE TABLE IF NOT EXISTS job_aids (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category ENUM('Sales', 'Marketing', 'HR', 'Finance', 'Operations', 'Technical') DEFAULT 'Operations',
    type ENUM('PDF', 'Checklist', 'Manual', 'Video', 'Template') DEFAULT 'Manual',
    department VARCHAR(255) NOT NULL,
    file_path VARCHAR(500),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Training programs table
CREATE TABLE IF NOT EXISTS training (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type ENUM('Workshop', 'Online', 'Certification', 'Seminar', 'Conference') DEFAULT 'Workshop',
    duration VARCHAR(100) NOT NULL,
    target_audience VARCHAR(255) NOT NULL,
    status ENUM('Planning', 'Active', 'Completed', 'Cancelled') DEFAULT 'Planning',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO departments (name, members, coverage) VALUES
('Marketing', 3, 100),
('Sales', 2, 80),
('Engineering', 5, 100),
('Human Resources', 1, 60),
('Finance', 2, 90);

INSERT INTO members (name, email, phone, department, role) VALUES
('Sarah Johnson', 'sarah.j@company.com', '(555) 123-4567', 'Marketing', 'Manager'),
('Mike Chen', 'mike.c@company.com', '(555) 234-5678', 'Marketing', 'Specialist'),
('Emily Davis', 'emily.d@company.com', '(555) 345-6789', 'Marketing', 'Analyst'),
('David Wilson', 'david.w@company.com', '(555) 456-7890', 'Sales', 'Team Lead'),
('Lisa Brown', 'lisa.b@company.com', '(555) 567-8901', 'Sales', 'Specialist'),
('Alex Rodriguez', 'alex.r@company.com', '(555) 678-9012', 'Engineering', 'Manager'),
('Jessica Lee', 'jessica.l@company.com', '(555) 789-0123', 'Engineering', 'Team Lead'),
('Tom Anderson', 'tom.a@company.com', '(555) 890-1234', 'Engineering', 'Specialist'),
('Maria Garcia', 'maria.g@company.com', '(555) 901-2345', 'Human Resources', 'Manager'),
('John Smith', 'john.s@company.com', '(555) 012-3456', 'Finance', 'Manager'),
('Amy Taylor', 'amy.t@company.com', '(555) 123-4567', 'Finance', 'Analyst');

INSERT INTO stakeholders (name, organization, role, influence, interest) VALUES
('Robert Kim', 'TechCorp Inc.', 'CEO', 'High', 'High'),
('Jennifer White', 'Innovation Labs', 'CTO', 'High', 'Medium'),
('Michael Green', 'Future Systems', 'VP Sales', 'Medium', 'High');

INSERT INTO connections (opportunity, stakeholder, type, priority, status) VALUES
('Partnership Discussion', 'Robert Kim', 'Business', 'High', 'Active'),
('Technology Collaboration', 'Jennifer White', 'Technical', 'Medium', 'Planning'),
('Sales Opportunity', 'Michael Green', 'Sales', 'High', 'Active');

INSERT INTO impacts (`change`, department, impact_level, risk, mitigation) VALUES
('New Software Implementation', 'Engineering', 'High', 'Medium', 'Phased rollout'),
('Process Restructuring', 'Human Resources', 'Medium', 'Low', 'Training program'),
('Budget Reallocation', 'Finance', 'Medium', 'Low', 'Monthly reviews');

INSERT INTO plans (name, type, status, start_date, end_date) VALUES
('Q1 Marketing Campaign', 'Marketing', 'Active', '2024-01-01', '2024-03-31'),
('Product Launch Strategy', 'Product', 'Planning', '2024-02-01', '2024-06-30'),
('Team Expansion', 'HR', 'Active', '2024-01-15', '2024-12-31');

INSERT INTO ideas (title, category, status, submitted_by, priority) VALUES
('AI-Powered Analytics Dashboard', 'Technology', 'Under Review', 'Alex Rodriguez', 'High'),
('Remote Work Optimization', 'Process', 'Approved', 'Maria Garcia', 'Medium'),
('Customer Feedback System', 'Product', 'Planning', 'Sarah Johnson', 'High');

INSERT INTO job_aids (title, category, type, department) VALUES
('Sales Process Guide', 'Sales', 'PDF', 'Sales'),
('Marketing Checklist', 'Marketing', 'Checklist', 'Marketing'),
('HR Onboarding Manual', 'HR', 'Manual', 'Human Resources');

INSERT INTO training (name, type, duration, target_audience, status) VALUES
('Leadership Development', 'Workshop', '2 days', 'Managers', 'Active'),
('Technical Skills Training', 'Online', '4 weeks', 'Engineers', 'Planning'),
('Sales Excellence Program', 'Certification', '6 months', 'Sales Team', 'Active');

-- Create indexes for better performance
CREATE INDEX idx_members_department ON members(department);
CREATE INDEX idx_connections_stakeholder ON connections(stakeholder);
CREATE INDEX idx_impacts_department ON impacts(department);
CREATE INDEX idx_ideas_status ON ideas(status);
CREATE INDEX idx_training_status ON training(status);

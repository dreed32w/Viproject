# IT Infrastructure & Asset Management Platform

A robust, enterprise-ready web application designed for comprehensive IT asset management, employee allocations, hardware issue tracking, user account administration, and purchase request workflows. Built on top of Laravel, this system provides modularity, high security, and scalability similar to enterprise resource planning (ERP) modules like Odoo's Parque Informatique.

---

## Overview

Managing corporate IT hardware, software licenses, and employee assignments across an organization requires strict accountability and clear visibility. This application delivers a central hub for tracking hardware lifecycle stages, managing employee accounts, routing maintenance and repair tickets, and overseeing equipment procurement workflows.

It is engineered with a strong emphasis on security, role-based access control, and audit readiness, making it suitable for medium to large-scale enterprises.

---

## Key Features

* **IT Asset & Inventory Management:** Complete cataloging of computers, monitors, peripherals, and network devices with unique IDs, technical specifications, and status logs.
* **Employee Assignments (Affectation):** Track hardware assignment history per employee, check-in/check-out dates, and active responsibility logs.
* **Maintenance & Repair Tracking:** Incident reporting for hardware failures, repair status monitoring, and resolution logs.
* **User & Account Management:** Comprehensive user profiles, department mappings, and fine-grained permissions for system access.
* **Procurement & Orders (Commands):** Structured request workflows for purchasing new equipment, stock fulfillment, and supplier order tracking.
* **Enterprise Security:** Input sanitization, secure authentication mechanisms, strict authorization checks, and defense against common web vulnerabilities.

---

## Screenshots

Below are interface previews demonstrating key workflows across the system:

### 1. Dashboard Overview

<img width="1355" height="599" alt="1" src="https://github.com/user-attachments/assets/582a111d-8226-4944-becc-ad2c826e0c75" />

*Central dashboard displaying inventory metrics, recent allocations, and open maintenance tickets.*

### 2. Asset Allocation & Management

<img width="1366" height="601" alt="2" src="https://github.com/user-attachments/assets/c96e66aa-1915-40aa-b1ab-45953167ec73" />

*Detailed view for assigning equipment to employees and tracking lifecycle status.*

### 3. Maintenance & Failure Reporting

<img width="1364" height="599" alt="3" src="https://github.com/user-attachments/assets/fb19d97f-c5ed-475d-ba89-4d3e525ee21a" />

*Tracking hardware breakdowns, assigning technicians, and maintaining repair histories.*

### 4. Orders & Procurement Management

<img width="1364" height="580" alt="4" src="https://github.com/user-attachments/assets/cb44a688-c1d3-4da1-a83a-78313de45912" />
<img width="1366" height="596" alt="6" src="https://github.com/user-attachments/assets/4525b8ad-db6d-4ef7-bf2d-fca24e8248ef" />
<img width="1366" height="593" alt="5" src="https://github.com/user-attachments/assets/5bc6e546-79dc-42c5-8ec2-690738e7822f" />

*Managing equipment acquisition requests, purchase orders, and vendor interactions.*

---

## Installation & Setup

Follow these steps to deploy and run the application locally:

### 1. Prerequisites Installation
Download and install PHP and Composer on your machine before proceeding.

### 2. Environment Configuration
Open the `.env` file and configure your email credentials and database name:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=#database_name
DB_USERNAME=root
DB_PASSWORD=

MAIL_MAILER=smtp
MAIL_SCHEME=null
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=#your email address
MAIL_PASSWORD= #your app password
MAIL_FROM_ADDRESS=#your email address
MAIL_FROM_NAME="your company name"
```

### 3. Database Creation
Create a new database on MySQL (e.g., via phpMyAdmin) using only the database name specified in `.env`.

### 4. Admin Account Seeding Configuration
Fill in the administrator details inside `database/seeders/AdminSeeder.php`:

```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'nom'=>'nom',
            'prenom'=>'prenom',
            'email' => 'exemple@gmail.com',
            'cin'=>'ABCDEF',
            'role'=>'admin',
            'password'=>'0000000000',
            'telephone'=>'000000000'
        ]);
    }
}
```

### 5. Database Migrations
Run the database migration command in your terminal:
```bash
php artisan migrate
```

### 6. Database Seeding
Execute the seeder command to populate the database with the admin user:
```bash
php artisan db:seed
```

### 7. Launch Application
Run the following two commands concurrently in your terminal to start both the server and the frontend assets:
```bash
php artisan serve
```
```bash
npm run dev
```

### 8. Access Application
Open your browser and navigate to the URL provided by `php artisan serve` to launch the website.

---

## Security & Architecture

This application is engineered for enterprise deployment with strict security measures:
* Multi-factor authentication readiness and role-based access control (RBAC).
* Protection against standard vulnerabilities including CSRF, XSS, and SQL Injection.
* Audited request validation across all administrative endpoints.

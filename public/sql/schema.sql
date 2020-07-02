CREATE TABLE manager(
    id INT NOT NULL AUTO_INCREMENT,
    fname VARCHAR(255),
    lname VARCHAR(255),
    email VARCHAR(255),
    phone INT(20),
    managerchk BOOLEAN,
    password VARCHAR(255),
    PRIMARY KEY(id)
);

CREATE TABLE staff(
    staff_id INT NOT NULL AUTO_INCREMENT,
    fname  VARCHAR(255) NOT NULL,
    lname VARCHAR (255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone INT(20),
    roles VARCHAR(255) NOT NULL,
    manager VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY(staff_id)
);

CREATE TABLE roles(
    role_id INT NOT NULL AUTO_INCREMENT,
    fname VARCHAR(255),
    lname VARCHAR(255),
    roles VARCHAR(255),
    PRIMARY KEY(role_id)
);

CREATE TABLE shifts(
    shift_id INT NOT NULL AUTO_INCREMENT,
    fname VARCHAR(255) NOT NULL,
    lname VARCHAR(255) NOT NULL,
    tstart VARCHAR(255) NOT NULL,
    tend VARCHAR(255) NOT NULL,
    roles VARCHAR(255),
    descript VARCHAR(255),
    PRIMARY KEY(shift_id)
);
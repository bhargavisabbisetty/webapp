DROP TABLE IF EXISTS `userdetails`;

CREATE TABLE userdetails (
       id varchar(200) NOT NULL,
       first_name varchar(255),
       last_name varchar(255),
       email_address varchar(255) NOT NULL,
       password varchar(255) NOT NULL,
       account_created TIMESTAMP NOT NULL,
       account_updated TIMESTAMP NOT NULL,
       PRIMARY KEY (email_address)
);

INSERT INTO userdetails
VALUES (
	"1",
	"Foo",
	"Baz",
	"foo.fsd@fdsf.com",
	"bhargavI01@",
    now(),
    now()
);
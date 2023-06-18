# E-commerce
## A shop that would allow users to buy and seel cats

## Spent few weekends on building this project, learned plenty, as in the last commit message, plenty room to improve the looks of the app

## Things that have been done
1. Whole app done using React framework
2. Server side done using node.js, express
3. Some of the Libraries used
   -redux
   -passport
   -multer
   -cors
   -bcrypt
   -stripe
   -dotenv
   -node-postgress

4. Database in postgresql
  - Creating the messages db CREATE TABLE messages (
	id SERIAL PRIMARY KEY,
  sender_id integer REFERENCES users(id),
  sender_name varchar(100),
  sender_surname varchar(100),
  sender_email varchar(100),
	message varchar(500),
  receiver_id integer REFERENCES users(id),
  date_of_message date,
  sale_agreed boolean DEFAULT false,
  paid boolean DEFAULT false,
  asked_price integer,
  cat_id integer REFERENCES cats_for_sale(id),
  message_read boolean DEFAULT false
  
);
 - Creating the cats_for_sale db  CREATE TABLE cats_for_sale(
	id SERIAL PRIMARY KEY,
	user_id integer REFERENCES users(id),
  price integer,
  gender varchar(10),
  date_of_birth date,
  date_for_sale date,
  sold_date date,
  breed_id integer REFERENCES cat_breeds(id),
  images_path varchar(100))
;
- There is need for users db
- The table holding the cat breeds has been fetched from https://thecatapi.com/


## Well that was fun, now on to do something more meaningfull!! :)

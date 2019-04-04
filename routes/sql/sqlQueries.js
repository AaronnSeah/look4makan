
const available_restaurants = 'SELECT R.rname, location FROM ((advertises  natural join restaurants) natural join branches) R WHERE EXISTS ( SELECT 1 FROM freetables F WHERE F.rname = R.rname AND F.bid = R.bid AND F.availableSince < $1);';
const branch_w_status = 'WITH restaurantStatus AS ( SELECT rname, bid, COUNT(tid) AS num FROM freetables GROUP BY rname, bid ) SELECT R.rname, location, CASE WHEN (opentime > $1 OR closeTime < $1) THEN \'CLOSED\' WHEN num > 0 THEN \'AVAILABLE\' WHEN num = 0 THEN \'FULL\' WHEN num = NULL THEN \'UNAVAILABLE\' END AS status FROM (advertises NATURAL JOIN restaurants NATURAL JOIN branches) R LEFT JOIN restaurantStatus S ON R.rname = S.rname AND R.bid = S.bid;';
const get_restaurant = 'WITH restaurantStatus AS ( SELECT rname, bid, COUNT(tid) AS num FROM freetables GROUP BY rname, bid ) SELECT DISTINCT R.rname, location, openinghours, opentime, closetime, CASE WHEN (opentime > $1 OR closeTime < $1) THEN \'CLOSED\' WHEN num > 0 THEN \'AVAILABLE\' WHEN num = 0 THEN \'FULL\' END AS status FROM (restaurants R LEFT JOIN branches B ON R.rname = B.rname) LEFT JOIN restaurantStatus S ON R.rname= S.rname WHERE R.rname = $2;';
const find_restaurant = 'WITH restaurantStatus AS ( SELECT rname, bid, COUNT(tid) AS num FROM freetables GROUP BY rname, bid ) SELECT distinct R.rname, openinghours, location, CASE WHEN (opentime > $2 OR closeTime < $2) THEN \'CLOSED\' WHEN num > 0 THEN \'AVAILABLE\' WHEN num = 0 THEN \'FULL\' WHEN num IS NULL THEN \'UNAVAILABLE\' END AS status FROM (restaurants NATURAL JOIN branches) R LEFT JOIN restaurantStatus S ON R.rname = S.rname AND R.bid = S.bid WHERE LOWER(R.rname) LIKE $1;'
const find_postal_code = 'WITH restaurantStatus AS ( SELECT rname, bid, COUNT(tid) AS num FROM freetables GROUP BY rname, bid ) SELECT DISTINCT R.rname, openinghours, location, CASE WHEN (opentime > $1 OR closeTime < $1) THEN \'CLOSED\' WHEN num > 0 THEN \'AVAILABLE\' WHEN num = 0 THEN \'FULL\' END AS status FROM (restaurants R LEFT JOIN branches B ON R.rname = B.rname) LEFT JOIN restaurantStatus S ON R.rname = S.rname WHERE ABS(B.postalCode - $2) <= 9999;'
const add_user = 'INSERT INTO diners (userName, password, firstName, lastName, isAdmin) VALUES ($1, $2, $3, $4, FALSE);'
const find_user_preference = 'SELECT distinct rname, openingHours, location FROM branches B natural JOIN freeTables F WHERE lower(B.rname) like $1 and B.location in ($2) and cuisineType in ($3) and B.openTime <= $4 and B.closeTime >= $4 and F.pax >= $5 and F.availableSince <= $4;'
const userpass = 'SELECT * FROM diners WHERE username = $1'


const queries = {
  findAllAvailableRestaurants: available_restaurants,
  allBranchWithStatus: branch_w_status,
  findRestaurant: find_restaurant,
  findWithPostCode: find_postal_code,
  findWithUserPreference: find_user_preference,
  add_user: add_user,
  userpass: userpass
}

module.exports = queries

INSERT INTO users VALUES(
  $(id),
  $(name),
  $(phone),
  $(zipcode),
  $(status)
) RETURNING id

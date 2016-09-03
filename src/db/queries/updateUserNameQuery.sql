UPDATE users
  SET name = $(name)
  WHERE phone = $(phone);

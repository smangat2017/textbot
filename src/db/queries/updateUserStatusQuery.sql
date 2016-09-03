UPDATE users
  SET status = $(status)
  WHERE phone = $(phone);

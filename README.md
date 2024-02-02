Next steps

Need to figure out how to check the accessToken on each component render and then refresh the accessToken if needed.

If the refresh fails then the login state needs to be set to false

If the refresh token succeeds then let the user access the route

Also need to implement that if the refreshToken expires we should remove it from the cookies and then remove it from the database refresh token list.

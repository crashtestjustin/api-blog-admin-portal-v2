Next steps

Need to figure out a way to clean up the database list of refresh tokens once they are expired so we can keep that area clean and prevent risks of unlimited user refresh access.

This has mostly been done - Just need to confirm working once the above is fixed:

If the refresh fails then the login state needs to be set to false

If the refresh token succeeds then let the user access the route

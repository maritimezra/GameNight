import strawberry
from apps.accounts.schema import Query as AccountsQuery, Mutation as AccountsMutation
from apps.lobbies.schema import (
    Query as TODQuery,
    Mutation as TODMutation,
)


@strawberry.type
class Query(AccountsQuery, TODQuery):
    pass


@strawberry.type
class Mutation(AccountsMutation, TODMutation):
    pass


schema = strawberry.Schema(query=Query, mutation=Mutation)

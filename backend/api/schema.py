import strawberry
from apps.accounts.schema import Query as AccountsQuery, Mutation as AccountsMutation
from apps.truthordare.schema import (
    Query as TruthOrDareQuery,
    Mutation as TruthOrDareMutation,
)


@strawberry.type
class Query(AccountsQuery, TruthOrDareQuery):
    pass


@strawberry.type
class Mutation(AccountsMutation, TruthOrDareMutation):
    pass


schema = strawberry.Schema(query=Query, mutation=Mutation)

# Query Expansion using Association Clusters
from collections import defaultdict
from QueryExpansion.util import tokenize_and_stem
# from indexer.solr_client import search

def findAssociations(localVocab, queryStems, doc_dict):
    associations = defaultdict(int)
    for stem in localVocab:
        for qStem in queryStems:
            cu = 0
            cv = 0
            for doc_terms in doc_dict.values():
                cs = doc_terms.count(stem)
                cqs = doc_terms.count(qStem)
                cu += cs
                cv += cqs
                associations[(qStem, stem)] += (cs*cqs)
            denominator = cu * cu + cv * cv + cu * cv
            if denominator == 0:
                associations[(qStem, stem)] = 0  # or skip this pair
            else:
                associations[(qStem, stem)] /= denominator
    return associations


def expandQueryAC(query, resultSet):
    tokens = []
    doc_dict = {}
    queryStems = tokenize_and_stem(query)
    for result in resultSet:
        doc_tokens = tokenize_and_stem(result['meta_info'])
        print("heyyaaa", result)
        doc_dict[result['url'][0]] = doc_tokens
        tokens.extend(doc_tokens)

    localVocab = set(tokens)
    associations = findAssociations(localVocab, queryStems, doc_dict)
    associations = sorted(associations.items(), key = lambda item:item[1], reverse = True)[:10]
    for item in associations:
        if item[0][1] not in queryStems:
            query += " " + item[0][1]
            queryStems.append(item[0][1])
    return query

# docs = search('swimming medals', 30)
# print(docs[0])
# new = expandQueryAC('olympics medals', docs)
# print(new)
# docs1 = search(new, 30)
# print(docs1[0])

# expandQueryAC('swimming medals', docs)
with open('scores.csv') as ar:
    with open('scores_clean.csv', 'w') as ar2:
        lines = ar.readlines()[0].strip().split(',')
        count = 0
        for i in lines:
            ar2.write(f"{count},{i}\n")
            count += 1
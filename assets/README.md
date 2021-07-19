## Arweave Notes

### GraphQL Query by Owner's Arweave Address
https://arweave.net/graphql

```
query {
    transactions(owners:["aikTf7F3DZ6QbWjuxTbtHsdkL_rpBFrMNnmJERZ8Tnc"]) {
        edges {
            node {
                id
              	block {
                  timestamp
                }
            }
        }
    }
}
```


## Filename

test rename
```bash
rename -v -n 's/^/498000_/' *.png
```

run rename
```bash
rename -v 's/^/498000_/' *.png
```
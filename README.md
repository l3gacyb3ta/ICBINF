# I CAN'T BELIEVE ITS NOT FORTH!

I CAN'T BELIEVE ITS NOT FORTH! is a forth-like stack-based language, with a web UI and a goal of being used to make little widgets everywhere.

Currently, it isn't well documented, but look at all the `builtin.ts` files to see the avaliable builtin functions.

## [Demo](https://arcades.agency/ICBINF/?loadfile=https://doggo.ninja/VoPUzO.icbinf)

## Examples

### Loop

```forth
( start stop )
0 10 do 
    i . ( print index )
loop
```

### Word definition

```forth
: addone ( n - n+1 )
    1 + ;

1 addone .
```

### If Statement

```forth
1 1 = if "one and one are equal" else "never reached" then .
1 2 = if "true (never reached)" else "false" then .
```

### Key/Value store

```forth
"Arcade" #name #set kv

"Hello " #name #get kv  ( "Hello " "Arcade" )
concat .
```

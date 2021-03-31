## thetacli tx split_rule

Initiate or update a split rule

### Synopsis

Initiate or update a split rule

```
thetacli tx split_rule [flags]
```

### Examples

```
thetacli tx split_rule --chain="privatenet" --from=2E833968E5bB786Ae419c4d13189fB081Cc43bab --seq=8 --resource_id=die_another_day --addresses=2E833968E5bB786Ae419c4d13189fB081Cc43bab,9F1233798E905E173560071255140b4A8aBd3Ec6 --percentages=30,30 --duration=1000
```

### Options

```
      --addresses strings     List of addresses participating in the split
      --chain string          Chain ID
      --duration uint         Reserve duration (default 1000)
      --fee string            Fee (default "1000000000000wei")
      --from string           Initiator's address
  -h, --help                  help for split_rule
      --percentages strings   List of integers (between 0 and 100) representing of percentage of split
      --resource_id string    The resourceID of interest
      --seq uint              Sequence number of the transaction
      --wallet string         Wallet type (soft|nano) (default "soft")
```

### Options inherited from parent commands

```
      --config string   config path (default is /Users/<username>/.thetacli) (default "/Users/<username>/.thetacli")
```

### SEE ALSO

* [thetacli tx](thetacli_tx.md)	 - Manage transactions

###### Auto generated by spf13/cobra on 24-Apr-2019
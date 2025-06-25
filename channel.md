Create a private channel for your network. Here's how:

On the Pi:

bash
meshtastic --seturl # Reset to default settings
meshtastic --ch-set name "BiotopPrivate" --ch-index 0
meshtastic --ch-set psk autogen --ch-index 0
On each sensor node:

bash
meshtastic --seturl # Reset to default settings
meshtastic --ch-add name "BiotopPrivate" psk autogen
Verify channel settings:

bash
meshtastic --info
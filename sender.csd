<CsoundSynthesizer>

<CsOptions>

-n

--omacro:port=1313
--omacro:instrument=exit
--omacro:instance=.00
--omacro:delay=0
--omacro:duration=0

</CsOptions>

<CsInstruments>

instr sender

#ifdef parameters

SParameters = "$parameters"

#else

SParameters = ""

#end

prints "parameters: '%s'\n", SParameters

OSCsend 1, "", $port, "oscilla", "sfffs", "$instrument", $instance, $delay, $duration, SParameters

endin

</CsInstruments>

<CsScore>

i "sender" 0 1

</CsScore>

</CsoundSynthesizer>

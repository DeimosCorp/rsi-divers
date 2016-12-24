#Use one:one profile in TrackIR
#Tweak Head Track sensitivity using "multiply = X"          PageDown to toggle on/off 
#Tweak Zooming sensitivity using "maxZoom = X"              End to toggle on/off 
#Tweak Lean/Strafe minimum distance using "minLean = X"     Delete to toggle on/off 

#__Change these variables to customize your experience__
if starting:
    enabledHT = True            # Set to True or False depending on if you want the headtracking to begin immediately 
    enabledZ = False             # Same for Zoom
    enabledL = False            # Same for Lean/Strafe
    multiply = 14               # Speed of head tracking
    maxZoom = 25                # Larger number means farther head travel needed to zoom all the way in, and visa versa
    minLean = 25                # How far you need to lean to trigger the Lean/Strafe buttons
    zoomZones = 5               # There are currently only 5 stages of zoom in the game, including unzoomed 

#__Change these button to remap the toggle keys__
toggleHT = keyboard.getPressed(Key.PageDown)    #Toggle Head Tracking
toggleZ = keyboard.getPressed(Key.End)          #Toggle Zoom 
toggleL = keyboard.getPressed(Key.Delete)       #Toggle Lean/Strafe


#=========================================================#
def update():
    yaw = trackIR.yaw
    pitch = trackIR.pitch
    zoom = -trackIR.z
    lean = trackIR.x

    global zone
    global previousZone
    global maxZoom
    global zoomZones

    deltaYaw = filters.delta(yaw)
    deltaPitch = filters.delta(pitch)
    deltaLean = filters.delta(lean)   

    #__Head Look Section__
    if (enabledHT):
        mouse.deltaX = deltaYaw*multiply    
        mouse.deltaY = -deltaPitch*multiply

    #__Zoom In/Out Section__
    if (enabledZ):
        i = 0
        while i < zoomZones :   
            zoomInterval = i * ( maxZoom / zoomZones )
            i += 1
            zoomInterval2 = i * ( maxZoom / zoomZones )
            if (zoomInterval <= zoom < zoomInterval2):
                previousZone = zone
                zone = i
                mouse.wheel = zone - previousZone

    #__Lean/Strafe Left/Right Section__
    if (enabledL):
        if (lean < -minLean) and (deltaLean < 0.1):
            keyboard.setKey(Key.Q, 1)
            keyboard.setKey(Key.E, 0)
        elif (lean > minLean) and (deltaLean > -0.1):
            keyboard.setKey(Key.Q, 0)
            keyboard.setKey(Key.E, 1)
        else:
            keyboard.setKey(Key.Q, 0)
            keyboard.setKey(Key.E, 0)


#__xxx Don't touch xxx__
if starting:
    zone = 1                    
    previousZone = 1            
    trackIR.update += update    

if toggleHT:
   speech.say("tracking to mouse")
   if(enabledHT):
      speech.say("off")
   enabledHT = not enabledHT

if toggleZ:
   enabledZ = not enabledZ 

if toggleL:
   enabledL = not enabledL

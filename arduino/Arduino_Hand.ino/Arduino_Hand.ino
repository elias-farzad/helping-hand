#include <Servo.h>
#include <ctype.h>   // for toupper()

// ---- Pins (change if needed) ----
const int PIN_THUMB  = 7;
const int PIN_INDEX  = 9;
const int PIN_MIDDLE = 11;
const int PIN_RING   = 8;
const int PIN_PINKY  = 10;

// ---- Angles (tune per finger if reversed) ----
int OPEN_T=120, OPEN_I=120, OPEN_M=120, OPEN_R=120, OPEN_P=120;
int CLOSE_T=0,   CLOSE_I=0,  CLOSE_M=0,  CLOSE_R=0,  CLOSE_P=0;

Servo sT, sI, sM, sR, sP;

void pose(int t, int i, int m, int r, int p, int holdMs=0) {
  sT.write(t); sI.write(i); sM.write(m); sR.write(r); sP.write(p);
  if (holdMs > 0) delay(holdMs);
}

void doGesture(char c) {
  c = toupper(c);  // enforce UPPERCASE

  switch (c) {
    // --- Examples you can use/extend ---

    case 'A': // A = fist (all closed)
      pose(CLOSE_T, CLOSE_I, CLOSE_M, CLOSE_R, CLOSE_P);
      break;

    case 'B': // B = flat hand (four open, thumb closed)
      pose(CLOSE_T, OPEN_I, OPEN_M, OPEN_R, OPEN_P);
      break;

    case 'C': // C = curved hand (approximate mid angles)
      pose(60, 60, 60, 60, 60);
      break;

    case 'I': // I = pinky open, others closed, thumb across
      pose(CLOSE_T, CLOSE_I, CLOSE_M, CLOSE_R, OPEN_P);
      break;

    case 'L': // L = thumb + index open (your example)
      pose(OPEN_T, OPEN_I, CLOSE_M, CLOSE_R, CLOSE_P);
      break;

    case 'V': // V = index + middle open
      pose(CLOSE_T, OPEN_I, OPEN_M, CLOSE_R, CLOSE_P);
      break;

    case 'W': // W = index + middle + ring open; pinky + thumb closed
      pose(CLOSE_T, OPEN_I, OPEN_M, OPEN_R, CLOSE_P);
      break;

    case 'Y': // Y = thumb + pinky open
      pose(OPEN_T, CLOSE_I, CLOSE_M, CLOSE_R, OPEN_P);
      break;

    // Add more letters here as you define them…

    default:
      // Unknown letter: do nothing (stays in current pose)
      break;
  }
}

void setup() {
  Serial.begin(9600);

  sT.attach(PIN_THUMB);
  sI.attach(PIN_INDEX);
  sM.attach(PIN_MIDDLE);
  sR.attach(PIN_RING);
  sP.attach(PIN_PINKY);

  // ---- State 0: start CLOSED ----
  pose(CLOSE_T, CLOSE_I, CLOSE_M, CLOSE_R, CLOSE_P);
}

void loop() {
  // Wait for uppercase letter commands from Serial
  if (Serial.available() > 0) {
    char c = (char)Serial.read();
    if (isAlpha(c)) {           // only react to letters
      doGesture(c);             // executes only when a letter arrives
    }
    // ignore any other chars (spaces/newlines/etc.)
  }

  // No auto-cycling. Nothing else happens until another char arrives.
}

import pygame
import math
import random
from tkinter import *
from tkinter import messagebox

Tk().wm_withdraw() 

pygame.init()
pygame.font.init()

screen = pygame.display.set_mode([1400, 1000])

running = True

screen.fill((0, 145, 108))

class Ship():
    def __init__(self, name, length, sposX, sposY, eposX, eposY):
        self.shipName = name
        self.shipLength = length
        self.shipStartPosX = sposX
        self.shipStartPosY = sposY
        self.shipEndPosX = sposX
        self.shipEndPosY = sposY
        self.shipDamage = 0
        self.shipSunk = False

        # if random.randint(1, 2) % 2 == 0:
        while self.shipEndPosY != self.shipStartPosY:
            self.shipStartPosY = random.randint(0, 10)
            self.shipEndPosY = random.randint(0, 10)

        while abs(self.shipEndPosX - self.shipStartPosX) != self.shipLength:
            self.shipStartPosX = random.randint(0, 10)
            self.shipEndPosX = random.randint(0, 10)
        
        # else:
        #     while self.shipEndPosX != self.shipStartPosX:
        #         self.shipStartPosX = random.randint(0, 10)
        #         self.shipEndPosX = random.randint(0, 10)

        #     while abs(self.shipEndPosY - self.shipStartPosY) != self.shipLength:
        #         self.shipStartPosY = random.randint(0, 10)
        #         self.shipEndPosY = random.randint(0, 10)


# ship1 = Ship("Dreadnought", 5, random.randint(0, 10), random.randint(0, 10), random.randint(0, 10), random.randint(0, 10))
# ship2 = Ship("Carrier", 5, random.randint(0, 10), random.randint(0, 10), random.randint(0, 10), random.randint(0, 10))
# ship3 = Ship("Cruiser", 4, random.randint(0, 10), random.randint(0, 10), random.randint(0, 10), random.randint(0, 10))
# ship4 = Ship("Destroyer", 3, random.randint(0, 10), random.randint(0, 10), random.randint(0, 10), random.randint(0, 10))
# ship5 = Ship("Submarine", 3, random.randint(0, 10), random.randint(0, 10), random.randint(0, 10), random.randint(0, 10))

ships = []

ship1 = Ship("Dreadnought", 5, 1, 1, 5, 1)
ship2 = Ship("Carrier", 5, 3, 5, 3, 5)
ship3 = Ship("Cruiser", 4, 5, 7, 5, 7)
ship4 = Ship("Destroyer", 3, 1, 3, 1, 3)
ship5 = Ship("Submarine", 3, 1, 9, 3, 9)

ships.append(ship1)
ships.append(ship2)
ships.append(ship3)
ships.append(ship4)
ships.append(ship5)

# for x in ships:
#     print("Type " + x.shipName + " Length "+ str(x.shipLength) + " Start position X " + str(x.shipStartPosX) + " Start positionY " + str(x.shipStartPosY) + " End position X " + str(x.shipEndPosX) + " End positionY " + str(x.shipEndPosY))

for x in range(10):
    for y in range(10):
        if y % 2 == 0:
            if x % 2 == 0:
                pygame.draw.rect(screen, (0, 105, 188), [90 * x, 90 * y, 90, 90], 0)
            if x % 2 == 1:
                pygame.draw.rect(screen, (0, 105, 128), [90 * x, 90 * y, 90, 90], 0)
        if y % 2 == 1:
            if x % 2 == 1:
                pygame.draw.rect(screen, (0, 105, 188), [90 * x, 90 * y, 90, 90], 0)
            if x % 2 == 0:
                pygame.draw.rect(screen, (0, 105, 128), [90 * x, 90 * y, 90, 90], 0)

myfont = pygame.font.SysFont('Arial', 90)
textUnder = myfont.render(' A  B  C  D  E  F  G  H  I  J ', False, (0, 0, 0))
pos = 1
textNext = [myfont.render(str(1 * i), False, (0, 0, 0)) for i in range(1, 11)]
p = 0
for entry in textNext:
    yPos = 90 * p
    screen.blit(entry, (900, yPos))
    p += 1
screen.blit(textUnder, (0, 900))

countShots = 0
countSunkShips = 0

victory = 0
time = 0

while running:
    ticks = pygame.time.get_ticks()
    x, y = pygame.mouse.get_pos()
    
    if ticks % 1000 == 0:
        pygame.draw.rect(screen, (0, 145, 108), [1000, 180, 400, 400], 0)
        textTime = myfont.render("Time: " + str(time), False, (0, 0, 0))
        screen.blit(textTime, (1000, 180))
        time += 1

    drawButton = myfont.render("Draw", False, (0, 0, 0))
    screen.blit(drawButton, (1000, 270))

    defeatButton = myfont.render("Defeat", False, (0, 0, 0))
    screen.blit(defeatButton, (1000, 360))

    for event in pygame.event.get():
        pygame.draw.rect(screen, (0, 145, 108), [1000, 180, 400, 90], 0)
        textTime = myfont.render("Time: " + str(time), False, (0, 0, 0))
        screen.blit(textTime, (1000, 180))

        drawButton = myfont.render("Draw", False, (0, 0, 0))
        screen.blit(drawButton, (1000, 270))

        defeatButton = myfont.render("Defeat", False, (0, 0, 0))
        screen.blit(defeatButton, (1000, 360))      

        pygame.draw.rect(screen, (0, 145, 108), [1000, 0, 400, 90], 0)
        textCount = myfont.render("Shots: " + str(countShots), False, (0, 0, 0))
        screen.blit(textCount, (1000, 0))

        pygame.draw.rect(screen, (0, 145, 108), [1000, 90, 400, 90], 0)
        textSunk = myfont.render("Sunk: " + str(countSunkShips), False, (0, 0, 0))
        screen.blit(textSunk, (1000, 90))

        if event.type == pygame.QUIT:
            running = False
        if event.type == pygame.MOUSEBUTTONDOWN:
            if math.floor(x / 90) * 90 < 900 and math.floor(y / 90) < 900:
                pygame.draw.rect(screen, (255, 255, 255), [math.floor(x / 90) * 90, math.floor(y / 90) * 90, 90, 90], 0)

                # if screen.get_at(pygame.mouse.get_pos()) != (255, 255, 255, 255):
                pygame.draw.rect(screen, (0, 145, 108), [1000, 0, 400, 400], 0)
                textCount = myfont.render("Shots: " + str(countShots), False, (0, 0, 0))
                screen.blit(textCount, (1000, 0))

                pygame.draw.rect(screen, (0, 145, 108), [1000, 90, 400, 400], 0)
                textSunk = myfont.render("Sunk: " + str(countSunkShips), False, (0, 0, 0))
                screen.blit(textSunk, (1000, 90))
                countShots += 1

                if victory == 1:
                    messagebox.showinfo('You Won!!!','Wonderfull!!!')
                    pygame.quit()
                
                for ship in ships:
                    if min(ship.shipStartPosX * 90, ship.shipEndPosX * 90) <= x <= max(ship.shipStartPosX * 90, ship.shipEndPosX * 90) and math.floor(y / 90) * 90 == ship.shipStartPosY * 90:
                        pygame.draw.rect(screen, (255, 0, 0), [math.floor(x / 90) * 90, math.floor(y / 90) * 90, 90, 90], 0)
                        ship.shipDamage += 1
                        if ship.shipDamage == ship.shipLength:
                            ship.shipSunk = True
                            countSunkShips += 1

    if countSunkShips == 5:
        victory = 1

    pygame.display.flip()



# board = [["|~~~|" for x in range(10)] for y in range(10)]
# # print(board)

# characterX = 1
# characterY = 1 

# characterPosition = "|- -|"
# hit = "| X |"
# miss = "| O |"

# #                    startX, startY, endX, endY, hp, alive
# activeShips = [ "destroyer" : [2, 3, 4, 3, 3, 1], "dreadnought": [5, 5, 5, 9, 5, 1], "submarine": [10, 10, 8, 10, 3, 1], "cruiser": [1, 1, 4, 1, 4, 1], "recon": [6, 8, 7, 8, 2, 1]]
# sunkenShips = []

# board[characterX][characterY] = characterPosition

# while True:
#     for i in board:
#         print("----- ----- ----- ----- ----- ----- ----- ----- ----- -----")
#         print(" ".join(i))
#         print("----- ----- ----- ----- ----- ----- ----- ----- ----- -----")

#     print("Move your cannons with 'w', 'a', 's', 'd', shoot with 'enter'")

#     shot = input("choose direction of shot")
#     if shot == "w":
#         if board[characterX][characterY] != "| X |" and board[characterX][characterY] != "| O |" and board[characterX][characterY] != "|-X-|" and board[characterX][characterY] != "|-O-|":
#             board[characterX][characterY] = "|~~~|"
#         if board[characterX][characterY] == "|-X-|":
#             board[characterX][characterY] = "| X |"
#         if board[characterX][characterY] == "|-O-|":
#             board[characterX][characterY] = "| O |"
#         characterX -= 1
#         if board[characterX][characterY] != "| X |" and board[characterX][characterY] != "| O |" and board[characterX][characterY] != "|-X-|" and board[characterX][characterY] != "|-O-|":
#             board[characterX][characterY] = "|- -|"
#         else:
#             board[characterX][characterY] = "|-O-|"
#     elif shot == "s":
#         if board[characterX][characterY] != "| X |" and board[characterX][characterY] != "| O |" and board[characterX][characterY] != "|-X-|" and board[characterX][characterY] != "|-O-|":
#             board[characterX][characterY] = "|~~~|"
#         if board[characterX][characterY] == "|-X-|":
#             board[characterX][characterY] = "| X |"
#         if board[characterX][characterY] == "|-O-|":
#             board[characterX][characterY] = "| O |"
#         characterX += 1
#         if board[characterX][characterY] != "| X |" and board[characterX][characterY] != "| O |" and board[characterX][characterY] != "|-X-|" and board[characterX][characterY] != "|-O-|":
#             board[characterX][characterY] = "|- -|"
#         else:
#             board[characterX][characterY] = "|-O-|"
#     elif shot == "a":
#         if board[characterX][characterY] != "| X |" and board[characterX][characterY] != "| O |" and board[characterX][characterY] != "|-X-|" and board[characterX][characterY] != "|-O-|":
#             board[characterX][characterY] = "|~~~|"
#         if board[characterX][characterY] == "|-X-|":
#             board[characterX][characterY] = "| X |"
#         if board[characterX][characterY] == "|-O-|":
#             board[characterX][characterY] = "| O |"
#         characterY -= 1
#         if board[characterX][characterY] != "| X |" and board[characterX][characterY] != "| O |" and board[characterX][characterY] != "|-X-|" and board[characterX][characterY] != "|-O-|":
#             board[characterX][characterY] = "|- -|"
#         else:
#             board[characterX][characterY] = "|-O-|"
#     elif shot == "d":
#         if board[characterX][characterY] != "| X |" and board[characterX][characterY] != "| O |" and board[characterX][characterY] != "|-X-|" and board[characterX][characterY] != "|-O-|":
#             board[characterX][characterY] = "|~~~|"
#         if board[characterX][characterY] == "|-X-|":
#             board[characterX][characterY] = "| X |"
#         if board[characterX][characterY] == "|-O-|":
#             board[characterX][characterY] = "| O |"
#         characterY += 1
#         if board[characterX][characterY] != "| X |" and board[characterX][characterY] != "| O |" and board[characterX][characterY] != "|-X-|" and board[characterX][characterY] != "|-O-|":
#             board[characterX][characterY] = "|- -|"
#         else:
#             board[characterX][characterY] = "|-O-|"
#     elif shot == "":
#         if board[characterX][characterY] != "| X |" and board[characterX][characterY] != "| O |" and board[characterX][characterY] != "|-X-|" and board[characterX][characterY] != "|-O-|":
#             board[characterX][characterY] = "| O |"
#         else:
#             print("Do not loose shots!")
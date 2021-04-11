import pygame
import math

pygame.init()
pygame.font.init()

screen = pygame.display.set_mode([1200, 1000])

running = True

screen.fill((0, 145, 108))

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

while running:

    x, y = pygame.mouse.get_pos()

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        if event.type == pygame.MOUSEBUTTONDOWN:
            pygame.draw.rect(screen, (255, 255, 255), [math.floor(x / 90) * 90, math.floor(y / 90) * 90, 90, 90], 0)

    pygame.display.flip()


pygame.quit()


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
const _ = require('lodash')
let l = console.log
let input = ""
let lines = ["test"]

function intersectRect(r1, r2) {
    return !(r2.x > r1.x+r1.w-1 ||
             r2.x+r2.w-1 < r1.x ||
             r2.y > r1.y+r1.h-1 ||
             r2.h+r2.y-1 < r1.y);
  }

function partOne() {
    let answer = ""
    let claims = []

    for (const line of lines) {
        vals = line.split(" ")
        let [idstr, _, xy, dims] = vals
        claims.push({
            id: parseInt(idstr.slice(1)),
            x: parseInt(xy.split(",")[0]),
            y: parseInt(xy.split(",")[1].slice(0, -1)),
            w: parseInt(dims.split("x")[0]),
            h: parseInt(dims.split("x")[1])
        })
    }

    let minX = _.min(claims.map(c => c.x))
    let maxX = _.max(claims.map(c => c.x+c.w))
    let minY = _.min(claims.map(c => c.y))
    let maxY = _.max(claims.map(c => c.y+c.h))

    let found = []
    for (let i = minX; i <= maxX; i++) {
        for (let j = minY; j <= maxY; j++) {
            if (claims.filter(c => i >= c.x && i < c.x+c.w && j >= c.y && j < c.y+c.h).length >= 2) {
                found.push([i, j])
                continue
            }
        }
        l(i)
    }

    l(found.length)
    l(_.uniqWith(found, (x, y) => _.isEqual(x, y)).length)
}

function partTwo() {
    let claims = []

    for (const line of lines) {
        vals = line.split(" ")
        let [idstr, _, xy, dims] = vals
        claims.push({
            id: parseInt(idstr.slice(1)),
            x: parseInt(xy.split(",")[0]),
            y: parseInt(xy.split(",")[1].slice(0, -1)),
            w: parseInt(dims.split("x")[0]),
            h: parseInt(dims.split("x")[1])
        })
    }

    let minX = _.min(claims.map(c => c.x))
    let maxX = _.max(claims.map(c => c.x+c.w))
    let minY = _.min(claims.map(c => c.y))
    let maxY = _.max(claims.map(c => c.y+c.h))

    let i = {}
    for (let c of claims) {
        if (i[c.id]) continue

        for (let c2 of claims) {
            if (c.id !== c2.id && intersectRect(c, c2)) {
                i[c.id] = true
                i[c2.id] = true
            }
            continue
        }
    }

    console.log(claims.filter(c => !i[c.id]))
}

function main() {
    partOne()
//    partTwo()
}

input = `
#1 @ 257,829: 10x23
#2 @ 902,685: 10x20
#3 @ 107,733: 20x25
#4 @ 186,421: 20x11
#5 @ 360,229: 29x10
#6 @ 362,248: 24x10
#7 @ 922,250: 13x26
#8 @ 256,742: 18x14
#9 @ 344,569: 28x15
#10 @ 381,793: 13x16
#11 @ 456,936: 28x27
#12 @ 110,25: 21x13
#13 @ 974,739: 12x12
#14 @ 364,641: 17x7
#15 @ 223,935: 24x25
#16 @ 803,147: 20x17
#17 @ 928,694: 13x12
#18 @ 549,438: 13x29
#19 @ 836,706: 18x25
#20 @ 890,557: 25x18
#21 @ 790,671: 16x19
#22 @ 433,548: 22x20
#23 @ 341,291: 21x5
#24 @ 324,168: 12x21
#25 @ 696,677: 12x12
#26 @ 480,769: 16x25
#27 @ 966,125: 13x26
#28 @ 889,760: 18x26
#29 @ 708,275: 19x13
#30 @ 581,706: 25x12
#31 @ 334,387: 29x23
#32 @ 292,246: 29x22
#33 @ 299,500: 24x23
#34 @ 834,644: 28x27
#35 @ 510,172: 27x14
#36 @ 24,35: 27x15
#37 @ 801,484: 22x28
#38 @ 974,891: 22x26
#39 @ 633,281: 27x10
#40 @ 523,582: 19x28
#41 @ 417,878: 13x21
#42 @ 712,897: 12x27
#43 @ 899,927: 16x27
#44 @ 269,693: 16x28
#45 @ 42,356: 11x15
#46 @ 547,849: 24x27
#47 @ 706,394: 29x27
#48 @ 768,325: 10x27
#49 @ 289,823: 11x11
#50 @ 561,758: 4x3
#51 @ 193,226: 27x19
#52 @ 501,584: 21x25
#53 @ 481,898: 11x12
#54 @ 516,588: 23x29
#55 @ 2,952: 28x22
#56 @ 238,706: 14x23
#57 @ 28,782: 10x28
#58 @ 642,873: 28x20
#59 @ 853,310: 12x26
#60 @ 889,242: 21x20
#61 @ 351,305: 16x21
#62 @ 799,981: 10x13
#63 @ 276,590: 19x18
#64 @ 645,874: 21x24
#65 @ 276,886: 22x22
#66 @ 874,840: 24x10
#67 @ 700,653: 18x29
#68 @ 853,676: 21x13
#69 @ 763,53: 10x14
#70 @ 17,887: 11x15
#71 @ 876,860: 20x15
#72 @ 930,561: 11x11
#73 @ 299,467: 26x16
#74 @ 233,741: 29x13
#75 @ 388,776: 13x27
#76 @ 310,521: 29x25
#77 @ 644,963: 29x18
#78 @ 238,804: 13x25
#79 @ 8,767: 18x26
#80 @ 936,237: 27x12
#81 @ 866,607: 13x16
#82 @ 500,917: 20x15
#83 @ 176,579: 22x22
#84 @ 294,251: 19x12
#85 @ 500,169: 21x16
#86 @ 704,954: 14x11
#87 @ 890,741: 24x19
#88 @ 49,956: 21x25
#89 @ 544,270: 19x18
#90 @ 324,911: 29x26
#91 @ 100,615: 16x18
#92 @ 656,946: 25x21
#93 @ 537,169: 13x22
#94 @ 201,303: 22x22
#95 @ 579,753: 12x10
#96 @ 853,554: 23x27
#97 @ 393,731: 29x19
#98 @ 955,618: 24x10
#99 @ 79,64: 15x16
#100 @ 277,408: 26x27
#101 @ 770,263: 29x24
#102 @ 408,812: 18x10
#103 @ 907,612: 10x28
#104 @ 28,701: 20x16
#105 @ 290,821: 16x27
#106 @ 632,698: 17x20
#107 @ 901,513: 10x26
#108 @ 316,580: 14x22
#109 @ 501,383: 25x10
#110 @ 125,212: 28x19
#111 @ 296,379: 14x29
#112 @ 63,253: 21x11
#113 @ 234,490: 28x10
#114 @ 526,481: 12x29
#115 @ 963,620: 28x10
#116 @ 484,759: 14x13
#117 @ 831,423: 11x11
#118 @ 223,156: 16x22
#119 @ 842,698: 25x20
#120 @ 472,809: 24x28
#121 @ 118,488: 16x14
#122 @ 202,818: 18x23
#123 @ 633,564: 20x20
#124 @ 787,611: 20x22
#125 @ 687,49: 16x27
#126 @ 157,617: 26x10
#127 @ 349,266: 22x13
#128 @ 203,455: 15x14
#129 @ 747,335: 24x26
#130 @ 288,709: 24x16
#131 @ 256,565: 27x24
#132 @ 246,698: 14x11
#133 @ 403,860: 14x13
#134 @ 451,715: 14x18
#135 @ 956,933: 24x14
#136 @ 231,565: 17x29
#137 @ 597,138: 23x14
#138 @ 653,607: 27x15
#139 @ 560,977: 22x10
#140 @ 636,360: 13x20
#141 @ 931,520: 19x20
#142 @ 725,714: 23x24
#143 @ 881,852: 18x23
#144 @ 626,342: 15x23
#145 @ 521,338: 15x12
#146 @ 100,651: 18x11
#147 @ 498,172: 29x18
#148 @ 12,975: 22x24
#149 @ 516,783: 23x21
#150 @ 406,434: 28x20
#151 @ 25,598: 17x10
#152 @ 460,321: 14x29
#153 @ 667,324: 20x14
#154 @ 444,439: 28x17
#155 @ 275,388: 20x17
#156 @ 624,265: 14x17
#157 @ 892,770: 11x11
#158 @ 6,769: 16x19
#159 @ 621,733: 29x21
#160 @ 368,884: 24x16
#161 @ 108,167: 26x19
#162 @ 955,730: 11x12
#163 @ 639,717: 15x26
#164 @ 89,329: 20x28
#165 @ 183,616: 21x11
#166 @ 161,499: 27x29
#167 @ 506,934: 11x12
#168 @ 879,309: 13x10
#169 @ 562,663: 24x14
#170 @ 663,57: 27x14
#171 @ 746,43: 27x10
#172 @ 588,389: 11x14
#173 @ 516,953: 17x13
#174 @ 678,676: 13x25
#175 @ 869,624: 26x15
#176 @ 953,876: 24x22
#177 @ 328,743: 25x20
#178 @ 629,805: 21x24
#179 @ 650,601: 14x20
#180 @ 496,804: 29x28
#181 @ 281,54: 15x22
#182 @ 112,632: 13x21
#183 @ 206,399: 11x13
#184 @ 952,608: 20x15
#185 @ 27,279: 26x27
#186 @ 534,182: 17x26
#187 @ 924,720: 13x20
#188 @ 487,980: 12x11
#189 @ 793,171: 20x13
#190 @ 930,971: 17x10
#191 @ 824,947: 27x12
#192 @ 474,777: 29x11
#193 @ 655,830: 18x28
#194 @ 508,540: 21x12
#195 @ 85,70: 29x14
#196 @ 498,929: 19x16
#197 @ 267,394: 15x20
#198 @ 438,891: 13x24
#199 @ 372,433: 19x29
#200 @ 22,932: 16x6
#201 @ 835,568: 28x10
#202 @ 889,893: 15x22
#203 @ 534,181: 15x13
#204 @ 206,213: 10x22
#205 @ 947,764: 14x25
#206 @ 332,830: 28x26
#207 @ 664,677: 12x11
#208 @ 804,602: 12x11
#209 @ 385,483: 26x24
#210 @ 806,372: 12x15
#211 @ 880,841: 29x13
#212 @ 354,253: 24x26
#213 @ 367,695: 21x27
#214 @ 388,617: 28x22
#215 @ 292,112: 16x15
#216 @ 61,787: 25x17
#217 @ 428,862: 16x25
#218 @ 23,265: 17x11
#219 @ 717,960: 11x13
#220 @ 416,776: 20x24
#221 @ 29,230: 18x11
#222 @ 681,11: 24x25
#223 @ 930,517: 19x14
#224 @ 801,256: 15x12
#225 @ 218,948: 27x18
#226 @ 697,406: 23x27
#227 @ 201,761: 11x17
#228 @ 692,278: 17x17
#229 @ 454,330: 22x18
#230 @ 161,743: 11x7
#231 @ 51,213: 15x25
#232 @ 182,979: 15x13
#233 @ 737,0: 27x18
#234 @ 404,631: 21x29
#235 @ 263,356: 26x27
#236 @ 24,799: 29x16
#237 @ 881,328: 10x12
#238 @ 960,759: 8x7
#239 @ 12,987: 26x12
#240 @ 642,886: 18x28
#241 @ 180,817: 26x20
#242 @ 824,428: 13x11
#243 @ 204,784: 11x27
#244 @ 495,789: 10x18
#245 @ 96,826: 14x24
#246 @ 758,677: 16x22
#247 @ 935,834: 12x26
#248 @ 151,741: 26x12
#249 @ 554,595: 26x14
#250 @ 623,284: 19x10
#251 @ 574,255: 16x10
#252 @ 886,881: 13x16
#253 @ 476,0: 17x11
#254 @ 805,100: 12x16
#255 @ 383,500: 23x26
#256 @ 155,452: 15x12
#257 @ 310,694: 28x28
#258 @ 518,788: 17x10
#259 @ 897,862: 13x16
#260 @ 269,395: 26x15
#261 @ 766,978: 10x22
#262 @ 935,962: 19x23
#263 @ 700,282: 25x23
#264 @ 342,6: 20x24
#265 @ 818,661: 27x29
#266 @ 816,809: 23x28
#267 @ 813,848: 11x12
#268 @ 112,285: 10x24
#269 @ 38,272: 16x18
#270 @ 277,361: 16x10
#271 @ 421,687: 17x11
#272 @ 942,827: 12x12
#273 @ 331,913: 15x19
#274 @ 880,218: 25x21
#275 @ 655,587: 24x27
#276 @ 537,739: 13x12
#277 @ 759,812: 13x29
#278 @ 926,238: 15x25
#279 @ 229,482: 15x21
#280 @ 917,772: 21x27
#281 @ 390,706: 3x18
#282 @ 972,703: 14x16
#283 @ 412,614: 7x4
#284 @ 583,135: 12x28
#285 @ 516,908: 27x17
#286 @ 20,930: 22x12
#287 @ 318,394: 25x12
#288 @ 677,665: 29x29
#289 @ 345,404: 15x11
#290 @ 83,48: 26x28
#291 @ 298,125: 22x19
#292 @ 509,929: 28x17
#293 @ 549,927: 27x13
#294 @ 801,644: 22x22
#295 @ 552,560: 24x24
#296 @ 809,100: 16x23
#297 @ 105,686: 12x20
#298 @ 620,612: 15x17
#299 @ 739,707: 13x13
#300 @ 853,627: 24x21
#301 @ 244,149: 21x27
#302 @ 265,582: 13x12
#303 @ 945,184: 18x29
#304 @ 808,418: 15x28
#305 @ 221,762: 13x17
#306 @ 612,684: 21x17
#307 @ 445,758: 28x21
#308 @ 950,273: 15x16
#309 @ 850,303: 12x15
#310 @ 394,285: 16x10
#311 @ 327,5: 22x29
#312 @ 69,435: 24x20
#313 @ 0,532: 14x14
#314 @ 373,950: 13x15
#315 @ 170,89: 21x27
#316 @ 754,36: 15x22
#317 @ 680,266: 29x22
#318 @ 388,450: 29x21
#319 @ 867,471: 25x28
#320 @ 336,278: 27x14
#321 @ 880,816: 14x28
#322 @ 547,278: 24x29
#323 @ 762,824: 6x4
#324 @ 179,492: 13x13
#325 @ 382,289: 17x27
#326 @ 867,461: 17x16
#327 @ 246,495: 10x16
#328 @ 960,200: 12x15
#329 @ 766,19: 23x12
#330 @ 158,119: 10x24
#331 @ 385,919: 11x19
#332 @ 804,637: 27x11
#333 @ 539,841: 19x23
#334 @ 115,963: 26x28
#335 @ 864,465: 22x10
#336 @ 325,679: 23x10
#337 @ 716,414: 11x21
#338 @ 599,636: 13x22
#339 @ 202,816: 23x16
#340 @ 596,652: 24x17
#341 @ 897,253: 18x14
#342 @ 558,192: 11x24
#343 @ 277,839: 20x14
#344 @ 271,671: 17x16
#345 @ 315,407: 19x27
#346 @ 217,934: 11x20
#347 @ 50,336: 27x17
#348 @ 286,823: 23x21
#349 @ 145,351: 24x10
#350 @ 681,802: 11x27
#351 @ 482,240: 24x21
#352 @ 544,629: 17x22
#353 @ 418,511: 15x26
#354 @ 301,251: 14x20
#355 @ 196,969: 27x26
#356 @ 314,687: 16x19
#357 @ 713,10: 25x21
#358 @ 963,626: 20x13
#359 @ 831,771: 24x18
#360 @ 853,546: 14x13
#361 @ 843,804: 23x13
#362 @ 22,941: 22x10
#363 @ 720,967: 18x15
#364 @ 718,956: 27x25
#365 @ 131,975: 25x21
#366 @ 216,668: 16x20
#367 @ 370,902: 21x10
#368 @ 794,694: 27x14
#369 @ 669,220: 27x24
#370 @ 89,659: 23x12
#371 @ 283,257: 11x18
#372 @ 240,306: 19x20
#373 @ 941,160: 29x18
#374 @ 421,709: 18x18
#375 @ 655,603: 20x27
#376 @ 290,879: 17x20
#377 @ 873,598: 10x22
#378 @ 555,653: 28x19
#379 @ 91,666: 20x16
#380 @ 263,488: 26x27
#381 @ 596,330: 22x23
#382 @ 237,773: 27x19
#383 @ 351,76: 14x25
#384 @ 129,221: 25x27
#385 @ 424,820: 11x23
#386 @ 225,952: 12x18
#387 @ 215,869: 20x25
#388 @ 405,644: 19x19
#389 @ 858,19: 17x28
#390 @ 829,252: 22x10
#391 @ 119,167: 27x19
#392 @ 335,196: 27x11
#393 @ 97,677: 14x13
#394 @ 588,931: 27x27
#395 @ 606,293: 20x24
#396 @ 930,964: 20x20
#397 @ 12,273: 24x23
#398 @ 567,107: 15x18
#399 @ 150,354: 24x10
#400 @ 913,732: 25x19
#401 @ 916,960: 29x13
#402 @ 443,924: 28x16
#403 @ 354,158: 11x29
#404 @ 364,471: 26x22
#405 @ 603,132: 14x29
#406 @ 60,548: 13x23
#407 @ 399,453: 16x11
#408 @ 964,728: 11x13
#409 @ 8,1: 23x15
#410 @ 18,491: 23x11
#411 @ 641,948: 11x22
#412 @ 367,359: 18x29
#413 @ 624,694: 18x24
#414 @ 670,939: 20x24
#415 @ 665,500: 20x29
#416 @ 525,881: 23x14
#417 @ 317,737: 16x24
#418 @ 651,151: 17x12
#419 @ 479,84: 14x17
#420 @ 684,820: 12x29
#421 @ 491,618: 20x15
#422 @ 718,880: 11x23
#423 @ 831,404: 15x25
#424 @ 381,950: 12x20
#425 @ 606,634: 10x17
#426 @ 227,786: 18x18
#427 @ 536,180: 25x22
#428 @ 859,177: 20x12
#429 @ 460,534: 20x25
#430 @ 884,940: 22x24
#431 @ 171,836: 22x21
#432 @ 32,355: 11x27
#433 @ 157,828: 15x28
#434 @ 636,468: 16x29
#435 @ 883,511: 16x27
#436 @ 51,331: 15x12
#437 @ 807,501: 18x12
#438 @ 62,180: 13x12
#439 @ 312,528: 19x15
#440 @ 166,511: 13x14
#441 @ 482,611: 12x12
#442 @ 210,579: 11x22
#443 @ 728,625: 14x17
#444 @ 456,717: 13x21
#445 @ 606,273: 12x21
#446 @ 303,466: 22x15
#447 @ 976,355: 19x12
#448 @ 720,771: 11x13
#449 @ 290,274: 12x24
#450 @ 11,807: 12x25
#451 @ 409,660: 15x12
#452 @ 913,523: 26x14
#453 @ 438,897: 10x11
#454 @ 50,270: 17x21
#455 @ 290,423: 15x16
#456 @ 688,235: 10x15
#457 @ 982,343: 16x26
#458 @ 714,779: 27x13
#459 @ 655,667: 13x24
#460 @ 877,221: 10x15
#461 @ 695,674: 17x22
#462 @ 804,159: 15x17
#463 @ 935,682: 28x23
#464 @ 32,190: 25x14
#465 @ 917,691: 24x25
#466 @ 440,369: 25x12
#467 @ 125,193: 23x24
#468 @ 362,638: 24x29
#469 @ 686,89: 28x15
#470 @ 899,495: 23x19
#471 @ 760,679: 29x22
#472 @ 727,206: 7x10
#473 @ 406,446: 21x24
#474 @ 26,333: 17x29
#475 @ 913,952: 20x24
#476 @ 548,628: 16x10
#477 @ 155,872: 24x28
#478 @ 389,904: 22x23
#479 @ 539,210: 16x12
#480 @ 871,680: 13x19
#481 @ 556,595: 13x11
#482 @ 129,531: 19x16
#483 @ 671,637: 25x25
#484 @ 323,698: 21x29
#485 @ 591,617: 15x14
#486 @ 343,252: 20x18
#487 @ 437,206: 15x10
#488 @ 291,408: 23x29
#489 @ 678,92: 17x28
#490 @ 888,233: 10x29
#491 @ 215,831: 14x17
#492 @ 570,752: 24x13
#493 @ 751,331: 18x27
#494 @ 715,956: 16x19
#495 @ 300,679: 17x16
#496 @ 500,392: 20x17
#497 @ 332,704: 24x17
#498 @ 505,499: 27x20
#499 @ 318,473: 13x28
#500 @ 961,528: 14x15
#501 @ 572,190: 20x29
#502 @ 668,762: 12x19
#503 @ 784,38: 27x13
#504 @ 31,253: 29x12
#505 @ 940,849: 26x14
#506 @ 877,88: 17x26
#507 @ 740,714: 20x23
#508 @ 671,373: 21x16
#509 @ 418,713: 23x12
#510 @ 731,649: 24x24
#511 @ 32,279: 29x21
#512 @ 712,907: 27x23
#513 @ 948,516: 19x24
#514 @ 372,177: 13x20
#515 @ 746,936: 11x13
#516 @ 102,828: 4x18
#517 @ 445,18: 19x22
#518 @ 371,84: 18x26
#519 @ 882,80: 21x26
#520 @ 337,906: 17x28
#521 @ 559,749: 11x17
#522 @ 947,303: 24x29
#523 @ 504,945: 17x23
#524 @ 24,801: 15x22
#525 @ 527,810: 15x28
#526 @ 382,305: 12x10
#527 @ 248,568: 15x24
#528 @ 931,735: 10x20
#529 @ 468,773: 10x23
#530 @ 616,255: 19x22
#531 @ 529,873: 19x25
#532 @ 548,799: 15x24
#533 @ 377,165: 28x13
#534 @ 200,638: 21x17
#535 @ 178,758: 16x17
#536 @ 65,940: 22x20
#537 @ 229,679: 24x10
#538 @ 196,906: 7x7
#539 @ 167,518: 15x10
#540 @ 974,455: 26x28
#541 @ 756,49: 17x21
#542 @ 844,632: 21x10
#543 @ 44,532: 11x22
#544 @ 153,612: 19x10
#545 @ 756,34: 17x14
#546 @ 507,233: 11x26
#547 @ 983,759: 12x11
#548 @ 600,41: 25x18
#549 @ 350,403: 17x19
#550 @ 392,624: 26x10
#551 @ 725,862: 28x21
#552 @ 808,315: 11x21
#553 @ 848,771: 29x10
#554 @ 193,954: 26x22
#555 @ 869,909: 14x10
#556 @ 569,677: 26x28
#557 @ 482,11: 24x16
#558 @ 974,474: 23x26
#559 @ 932,830: 16x19
#560 @ 14,262: 16x19
#561 @ 367,902: 28x26
#562 @ 169,485: 16x11
#563 @ 724,637: 25x15
#564 @ 371,609: 26x11
#565 @ 6,829: 17x20
#566 @ 887,827: 22x17
#567 @ 22,31: 19x12
#568 @ 268,702: 23x18
#569 @ 98,232: 14x14
#570 @ 446,700: 10x29
#571 @ 774,780: 12x27
#572 @ 624,168: 20x14
#573 @ 814,297: 23x23
#574 @ 419,526: 25x27
#575 @ 441,885: 13x20
#576 @ 890,698: 25x21
#577 @ 1,900: 21x29
#578 @ 328,917: 13x20
#579 @ 963,189: 26x22
#580 @ 858,87: 16x12
#581 @ 954,816: 19x29
#582 @ 566,129: 23x18
#583 @ 888,811: 19x27
#584 @ 753,313: 29x21
#585 @ 414,71: 29x10
#586 @ 734,423: 23x13
#587 @ 445,315: 23x13
#588 @ 834,295: 23x16
#589 @ 545,172: 13x25
#590 @ 201,280: 22x18
#591 @ 876,825: 24x15
#592 @ 877,665: 12x27
#593 @ 940,800: 19x11
#594 @ 101,144: 27x25
#595 @ 940,459: 19x26
#596 @ 800,588: 23x20
#597 @ 204,886: 10x21
#598 @ 873,891: 15x19
#599 @ 59,329: 25x15
#600 @ 681,847: 22x18
#601 @ 86,624: 11x29
#602 @ 901,600: 23x13
#603 @ 562,257: 25x19
#604 @ 960,818: 10x23
#605 @ 885,298: 29x18
#606 @ 370,149: 27x24
#607 @ 706,395: 16x17
#608 @ 920,22: 27x19
#609 @ 407,612: 20x12
#610 @ 494,596: 23x15
#611 @ 36,597: 17x27
#612 @ 92,233: 23x15
#613 @ 537,457: 13x21
#614 @ 835,125: 29x14
#615 @ 918,724: 20x13
#616 @ 242,925: 18x14
#617 @ 209,859: 17x17
#618 @ 466,140: 17x21
#619 @ 415,777: 21x28
#620 @ 490,7: 13x20
#621 @ 423,913: 26x23
#622 @ 296,599: 10x28
#623 @ 498,577: 26x16
#624 @ 773,659: 13x15
#625 @ 263,847: 13x17
#626 @ 741,375: 28x26
#627 @ 100,808: 4x3
#628 @ 525,308: 18x26
#629 @ 955,940: 15x28
#630 @ 432,367: 22x24
#631 @ 580,693: 6x3
#632 @ 483,628: 10x11
#633 @ 822,479: 25x25
#634 @ 533,561: 12x23
#635 @ 711,270: 13x24
#636 @ 932,951: 23x24
#637 @ 684,683: 17x26
#638 @ 236,537: 19x28
#639 @ 953,217: 21x23
#640 @ 248,155: 14x18
#641 @ 761,627: 20x23
#642 @ 343,864: 13x13
#643 @ 8,538: 20x19
#644 @ 568,547: 17x25
#645 @ 20,945: 18x23
#646 @ 612,256: 25x12
#647 @ 302,964: 6x17
#648 @ 570,901: 11x22
#649 @ 184,429: 25x13
#650 @ 257,224: 25x24
#651 @ 63,448: 29x11
#652 @ 927,499: 11x23
#653 @ 501,228: 11x23
#654 @ 291,606: 20x20
#655 @ 857,26: 16x16
#656 @ 648,779: 13x22
#657 @ 216,304: 10x15
#658 @ 349,856: 18x29
#659 @ 10,939: 21x26
#660 @ 287,894: 18x17
#661 @ 888,680: 13x15
#662 @ 288,358: 19x29
#663 @ 106,203: 22x25
#664 @ 387,268: 25x27
#665 @ 466,122: 20x29
#666 @ 590,650: 25x12
#667 @ 978,488: 22x11
#668 @ 112,861: 19x14
#669 @ 20,885: 22x12
#670 @ 820,99: 13x21
#671 @ 420,898: 23x27
#672 @ 869,605: 29x26
#673 @ 123,471: 25x23
#674 @ 652,564: 17x28
#675 @ 414,883: 23x11
#676 @ 890,529: 22x27
#677 @ 406,372: 25x29
#678 @ 39,180: 27x20
#679 @ 12,928: 16x29
#680 @ 516,301: 10x21
#681 @ 681,314: 25x28
#682 @ 980,764: 18x29
#683 @ 879,571: 16x12
#684 @ 561,511: 22x24
#685 @ 226,257: 16x10
#686 @ 269,580: 11x16
#687 @ 217,473: 20x26
#688 @ 493,587: 21x27
#689 @ 19,767: 27x23
#690 @ 369,802: 14x11
#691 @ 656,976: 25x22
#692 @ 504,592: 11x24
#693 @ 143,677: 11x22
#694 @ 554,971: 12x25
#695 @ 968,698: 28x29
#696 @ 290,838: 23x18
#697 @ 572,419: 28x19
#698 @ 459,554: 13x17
#699 @ 393,375: 29x14
#700 @ 646,968: 12x22
#701 @ 917,18: 25x24
#702 @ 534,921: 20x23
#703 @ 217,679: 18x19
#704 @ 476,792: 22x28
#705 @ 844,833: 7x13
#706 @ 215,583: 18x23
#707 @ 688,18: 8x14
#708 @ 974,916: 25x18
#709 @ 214,842: 12x18
#710 @ 254,316: 24x22
#711 @ 831,722: 8x15
#712 @ 217,256: 23x20
#713 @ 956,281: 12x16
#714 @ 923,797: 16x11
#715 @ 788,40: 11x18
#716 @ 422,193: 22x17
#717 @ 475,84: 17x18
#718 @ 869,61: 24x29
#719 @ 266,189: 12x21
#720 @ 514,472: 18x10
#721 @ 344,314: 13x12
#722 @ 43,679: 26x28
#723 @ 943,845: 26x12
#724 @ 287,235: 28x27
#725 @ 503,615: 24x24
#726 @ 436,37: 10x18
#727 @ 312,576: 23x10
#728 @ 934,178: 21x29
#729 @ 925,693: 16x12
#730 @ 272,722: 19x18
#731 @ 66,539: 12x14
#732 @ 117,429: 14x23
#733 @ 213,557: 23x17
#734 @ 293,70: 18x28
#735 @ 804,578: 19x10
#736 @ 683,694: 28x24
#737 @ 14,280: 18x6
#738 @ 134,197: 22x12
#739 @ 928,398: 12x12
#740 @ 407,48: 14x29
#741 @ 440,702: 14x16
#742 @ 173,504: 20x24
#743 @ 572,559: 29x20
#744 @ 421,890: 23x28
#745 @ 605,628: 21x26
#746 @ 497,940: 18x19
#747 @ 61,99: 24x20
#748 @ 50,212: 11x28
#749 @ 314,185: 28x15
#750 @ 190,897: 22x25
#751 @ 97,75: 16x29
#752 @ 287,369: 15x11
#753 @ 435,218: 11x25
#754 @ 403,720: 22x15
#755 @ 353,696: 19x17
#756 @ 323,2: 25x20
#757 @ 744,581: 19x26
#758 @ 294,962: 26x22
#759 @ 567,7: 13x27
#760 @ 974,116: 21x13
#761 @ 781,767: 22x27
#762 @ 790,657: 24x21
#763 @ 860,622: 11x15
#764 @ 547,163: 24x26
#765 @ 794,156: 12x20
#766 @ 691,836: 13x16
#767 @ 576,118: 27x26
#768 @ 841,132: 29x11
#769 @ 210,582: 24x24
#770 @ 377,703: 20x25
#771 @ 844,558: 15x19
#772 @ 860,636: 18x23
#773 @ 246,788: 23x28
#774 @ 894,567: 15x17
#775 @ 284,892: 26x15
#776 @ 931,479: 12x26
#777 @ 116,684: 26x13
#778 @ 345,855: 21x10
#779 @ 725,204: 13x16
#780 @ 781,257: 23x19
#781 @ 677,959: 28x14
#782 @ 535,813: 17x19
#783 @ 538,806: 12x19
#784 @ 184,501: 22x17
#785 @ 596,661: 12x15
#786 @ 3,784: 16x21
#787 @ 556,880: 16x23
#788 @ 626,896: 17x11
#789 @ 944,823: 16x13
#790 @ 13,357: 20x15
#791 @ 363,73: 18x22
#792 @ 896,304: 28x26
#793 @ 455,519: 16x14
#794 @ 2,957: 14x26
#795 @ 148,552: 28x15
#796 @ 880,397: 13x17
#797 @ 759,676: 11x26
#798 @ 957,733: 5x5
#799 @ 450,892: 26x12
#800 @ 877,203: 23x22
#801 @ 500,533: 17x23
#802 @ 533,474: 21x24
#803 @ 169,797: 17x26
#804 @ 283,367: 25x27
#805 @ 797,325: 25x17
#806 @ 114,214: 22x19
#807 @ 462,317: 15x11
#808 @ 416,530: 28x16
#809 @ 562,167: 17x21
#810 @ 472,73: 27x14
#811 @ 397,669: 29x19
#812 @ 267,690: 16x18
#813 @ 412,567: 21x18
#814 @ 43,458: 11x16
#815 @ 350,236: 28x24
#816 @ 746,35: 17x27
#817 @ 665,176: 7x5
#818 @ 482,3: 10x15
#819 @ 877,908: 15x18
#820 @ 537,210: 27x12
#821 @ 41,795: 29x20
#822 @ 560,174: 10x10
#823 @ 267,380: 15x10
#824 @ 852,584: 25x22
#825 @ 955,937: 17x21
#826 @ 212,232: 10x21
#827 @ 396,498: 27x10
#828 @ 176,285: 25x29
#829 @ 96,460: 28x11
#830 @ 132,56: 23x29
#831 @ 457,85: 22x14
#832 @ 832,949: 22x14
#833 @ 745,615: 14x10
#834 @ 295,879: 11x16
#835 @ 357,451: 21x18
#836 @ 74,944: 13x26
#837 @ 943,124: 24x16
#838 @ 202,641: 19x26
#839 @ 877,276: 22x19
#840 @ 14,546: 13x21
#841 @ 925,699: 29x16
#842 @ 55,205: 28x18
#843 @ 45,526: 14x19
#844 @ 270,692: 22x15
#845 @ 375,916: 12x18
#846 @ 463,311: 12x20
#847 @ 754,348: 15x12
#848 @ 348,433: 14x27
#849 @ 69,335: 29x22
#850 @ 205,611: 23x12
#851 @ 333,514: 17x27
#852 @ 557,905: 25x24
#853 @ 824,785: 10x17
#854 @ 983,494: 13x16
#855 @ 391,926: 12x24
#856 @ 369,366: 12x7
#857 @ 370,456: 19x12
#858 @ 106,729: 11x13
#859 @ 126,420: 12x18
#860 @ 968,504: 23x18
#861 @ 887,140: 20x26
#862 @ 780,696: 14x28
#863 @ 405,753: 22x20
#864 @ 965,899: 17x21
#865 @ 855,56: 12x25
#866 @ 225,149: 23x28
#867 @ 834,829: 10x25
#868 @ 205,133: 23x10
#869 @ 219,125: 27x15
#870 @ 267,819: 28x28
#871 @ 583,172: 15x28
#872 @ 320,52: 20x28
#873 @ 380,675: 25x29
#874 @ 440,199: 10x28
#875 @ 553,927: 29x12
#876 @ 124,458: 10x17
#877 @ 326,7: 25x29
#878 @ 933,165: 14x28
#879 @ 440,707: 24x21
#880 @ 870,803: 22x17
#881 @ 134,899: 10x15
#882 @ 378,951: 13x18
#883 @ 908,745: 14x13
#884 @ 144,202: 26x11
#885 @ 685,363: 10x21
#886 @ 327,159: 3x10
#887 @ 215,569: 18x17
#888 @ 872,308: 13x14
#889 @ 55,894: 18x27
#890 @ 697,899: 21x29
#891 @ 447,954: 20x25
#892 @ 76,330: 28x13
#893 @ 817,378: 12x25
#894 @ 696,235: 21x20
#895 @ 121,460: 10x29
#896 @ 307,76: 19x23
#897 @ 99,346: 14x11
#898 @ 534,170: 16x28
#899 @ 180,474: 11x27
#900 @ 315,159: 25x21
#901 @ 975,107: 14x21
#902 @ 116,277: 27x17
#903 @ 959,516: 20x20
#904 @ 495,749: 17x16
#905 @ 334,230: 10x26
#906 @ 742,822: 21x18
#907 @ 138,886: 11x22
#908 @ 30,442: 24x19
#909 @ 922,571: 17x17
#910 @ 276,572: 19x21
#911 @ 878,408: 18x14
#912 @ 665,726: 11x17
#913 @ 73,260: 20x13
#914 @ 956,897: 15x15
#915 @ 891,321: 28x23
#916 @ 185,266: 29x24
#917 @ 648,160: 14x19
#918 @ 670,760: 14x14
#919 @ 9,659: 16x22
#920 @ 145,680: 5x9
#921 @ 527,439: 26x22
#922 @ 599,592: 26x29
#923 @ 208,204: 22x19
#924 @ 588,42: 15x20
#925 @ 904,500: 28x21
#926 @ 792,116: 29x27
#927 @ 7,656: 29x11
#928 @ 704,920: 12x29
#929 @ 122,528: 19x15
#930 @ 92,637: 23x15
#931 @ 867,756: 22x28
#932 @ 190,489: 11x22
#933 @ 207,604: 14x18
#934 @ 712,273: 29x17
#935 @ 961,18: 21x29
#936 @ 447,318: 14x23
#937 @ 519,912: 18x19
#938 @ 515,589: 29x22
#939 @ 648,818: 21x22
#940 @ 368,415: 26x24
#941 @ 16,345: 14x13
#942 @ 634,708: 13x10
#943 @ 843,667: 26x23
#944 @ 373,459: 16x19
#945 @ 899,873: 22x22
#946 @ 256,480: 10x19
#947 @ 505,236: 19x10
#948 @ 571,530: 22x28
#949 @ 333,771: 15x28
#950 @ 230,923: 17x13
#951 @ 786,566: 28x29
#952 @ 541,274: 14x11
#953 @ 889,85: 27x22
#954 @ 603,445: 26x27
#955 @ 888,458: 28x14
#956 @ 165,123: 14x16
#957 @ 721,81: 22x23
#958 @ 621,470: 19x20
#959 @ 290,391: 17x28
#960 @ 363,617: 22x17
#961 @ 527,198: 17x22
#962 @ 945,851: 17x11
#963 @ 549,864: 28x28
#964 @ 833,863: 19x20
#965 @ 960,603: 18x26
#966 @ 506,131: 5x21
#967 @ 592,630: 14x15
#968 @ 72,429: 13x24
#969 @ 553,153: 16x25
#970 @ 776,601: 29x21
#971 @ 904,460: 7x7
#972 @ 423,498: 29x27
#973 @ 12,953: 12x13
#974 @ 198,664: 21x24
#975 @ 765,636: 21x19
#976 @ 787,299: 29x29
#977 @ 966,495: 10x27
#978 @ 314,546: 28x26
#979 @ 810,316: 15x20
#980 @ 725,778: 24x13
#981 @ 829,414: 15x10
#982 @ 739,928: 12x14
#983 @ 656,98: 28x27
#984 @ 146,74: 3x6
#985 @ 642,791: 20x11
#986 @ 887,281: 26x23
#987 @ 511,373: 18x26
#988 @ 13,538: 19x15
#989 @ 845,249: 29x12
#990 @ 205,466: 11x28
#991 @ 12,494: 19x19
#992 @ 508,936: 3x5
#993 @ 543,268: 20x18
#994 @ 955,29: 29x10
#995 @ 925,780: 10x12
#996 @ 412,168: 23x26
#997 @ 719,957: 14x27
#998 @ 809,833: 18x27
#999 @ 800,404: 18x29
#1000 @ 225,935: 14x17
#1001 @ 638,566: 11x12
#1002 @ 140,72: 29x12
#1003 @ 217,755: 17x16
#1004 @ 508,608: 18x12
#1005 @ 546,720: 15x25
#1006 @ 502,380: 29x19
#1007 @ 429,524: 27x19
#1008 @ 334,787: 15x18
#1009 @ 217,949: 14x26
#1010 @ 288,523: 26x22
#1011 @ 534,936: 24x22
#1012 @ 314,404: 13x15
#1013 @ 50,228: 21x25
#1014 @ 584,124: 15x28
#1015 @ 882,110: 17x25
#1016 @ 208,955: 12x25
#1017 @ 30,347: 27x25
#1018 @ 371,898: 21x14
#1019 @ 756,388: 20x28
#1020 @ 184,889: 27x16
#1021 @ 964,461: 17x13
#1022 @ 389,764: 21x29
#1023 @ 712,706: 15x22
#1024 @ 420,191: 11x20
#1025 @ 711,650: 11x29
#1026 @ 361,847: 21x16
#1027 @ 722,418: 24x20
#1028 @ 598,690: 25x28
#1029 @ 753,978: 18x17
#1030 @ 251,676: 18x14
#1031 @ 191,405: 24x13
#1032 @ 830,870: 24x10
#1033 @ 373,801: 21x17
#1034 @ 956,593: 14x23
#1035 @ 380,949: 29x17
#1036 @ 703,765: 19x29
#1037 @ 82,672: 10x11
#1038 @ 17,228: 20x17
#1039 @ 531,343: 25x23
#1040 @ 197,282: 13x15
#1041 @ 169,580: 27x14
#1042 @ 340,156: 20x18
#1043 @ 328,820: 14x12
#1044 @ 187,565: 29x19
#1045 @ 872,178: 13x22
#1046 @ 810,502: 29x14
#1047 @ 543,519: 22x25
#1048 @ 460,726: 19x24
#1049 @ 191,904: 16x14
#1050 @ 190,198: 23x22
#1051 @ 666,197: 13x22
#1052 @ 356,789: 14x22
#1053 @ 639,181: 17x14
#1054 @ 596,643: 27x11
#1055 @ 961,317: 10x18
#1056 @ 433,768: 17x20
#1057 @ 52,795: 28x10
#1058 @ 352,801: 12x17
#1059 @ 669,738: 20x16
#1060 @ 101,863: 22x15
#1061 @ 803,141: 17x23
#1062 @ 198,472: 22x16
#1063 @ 642,518: 24x15
#1064 @ 440,273: 27x19
#1065 @ 588,927: 16x24
#1066 @ 303,563: 27x22
#1067 @ 689,721: 28x16
#1068 @ 836,874: 19x15
#1069 @ 752,809: 21x28
#1070 @ 790,242: 22x26
#1071 @ 435,204: 11x29
#1072 @ 608,291: 25x12
#1073 @ 176,419: 18x28
#1074 @ 598,372: 12x26
#1075 @ 890,293: 19x14
#1076 @ 569,33: 20x25
#1077 @ 127,803: 29x17
#1078 @ 552,169: 24x14
#1079 @ 983,484: 15x27
#1080 @ 772,662: 12x28
#1081 @ 678,178: 19x23
#1082 @ 277,899: 29x21
#1083 @ 588,229: 12x29
#1084 @ 844,229: 25x25
#1085 @ 688,913: 22x26
#1086 @ 470,882: 22x21
#1087 @ 813,678: 10x29
#1088 @ 427,181: 23x19
#1089 @ 8,941: 26x19
#1090 @ 946,802: 16x10
#1091 @ 646,610: 17x14
#1092 @ 701,281: 26x10
#1093 @ 240,217: 22x18
#1094 @ 120,214: 29x18
#1095 @ 854,794: 18x19
#1096 @ 179,767: 13x11
#1097 @ 250,383: 23x29
#1098 @ 519,277: 13x10
#1099 @ 395,618: 11x10
#1100 @ 886,893: 17x23
#1101 @ 429,436: 19x17
#1102 @ 200,938: 29x10
#1103 @ 124,794: 24x14
#1104 @ 874,265: 10x15
#1105 @ 483,784: 20x29
#1106 @ 489,933: 13x28
#1107 @ 222,932: 23x27
#1108 @ 714,633: 21x29
#1109 @ 761,322: 15x20
#1110 @ 83,347: 24x12
#1111 @ 523,889: 23x28
#1112 @ 101,672: 16x23
#1113 @ 936,704: 16x27
#1114 @ 861,236: 17x25
#1115 @ 951,125: 24x26
#1116 @ 688,681: 15x11
#1117 @ 391,758: 27x23
#1118 @ 808,778: 9x5
#1119 @ 831,238: 10x25
#1120 @ 204,474: 9x10
#1121 @ 625,813: 16x15
#1122 @ 45,886: 17x23
#1123 @ 561,938: 18x13
#1124 @ 350,880: 27x14
#1125 @ 628,401: 18x22
#1126 @ 488,807: 27x28
#1127 @ 848,947: 14x11
#1128 @ 863,76: 15x28
#1129 @ 174,893: 27x29
#1130 @ 894,483: 22x29
#1131 @ 680,78: 22x27
#1132 @ 748,604: 21x11
#1133 @ 855,759: 14x13
#1134 @ 953,117: 12x27
#1135 @ 930,402: 3x4
#1136 @ 663,174: 12x10
#1137 @ 396,869: 18x16
#1138 @ 451,559: 12x13
#1139 @ 709,79: 16x11
#1140 @ 804,970: 10x25
#1141 @ 339,287: 27x13
#1142 @ 181,961: 25x13
#1143 @ 553,208: 11x26
#1144 @ 192,417: 10x28
#1145 @ 77,92: 19x27
#1146 @ 796,121: 22x24
#1147 @ 194,616: 11x14
#1148 @ 595,147: 15x29
#1149 @ 84,437: 26x28
#1150 @ 338,87: 16x29
#1151 @ 806,774: 14x13
#1152 @ 841,880: 15x16
#1153 @ 650,491: 15x29
#1154 @ 501,498: 22x20
#1155 @ 611,632: 15x11
#1156 @ 753,732: 28x26
#1157 @ 199,966: 23x14
#1158 @ 873,812: 14x3
#1159 @ 25,12: 16x15
#1160 @ 96,800: 16x22
#1161 @ 354,716: 12x18
#1162 @ 612,404: 25x13
#1163 @ 193,897: 12x11
#1164 @ 284,376: 16x19
#1165 @ 203,636: 16x25
#1166 @ 797,583: 28x22
#1167 @ 558,259: 29x23
#1168 @ 391,930: 17x11
#1169 @ 120,459: 18x18
#1170 @ 708,270: 23x14
#1171 @ 474,974: 29x20
#1172 @ 872,333: 24x15
#1173 @ 67,183: 16x19
#1174 @ 915,799: 23x14
#1175 @ 662,437: 17x15
#1176 @ 925,831: 20x22
#1177 @ 977,500: 20x11
#1178 @ 475,766: 25x21
#1179 @ 281,677: 17x28
#1180 @ 425,562: 17x29
#1181 @ 542,568: 10x22
#1182 @ 702,684: 28x11
#1183 @ 157,221: 25x29
#1184 @ 490,606: 28x18
#1185 @ 654,432: 17x21
#1186 @ 523,271: 23x26
#1187 @ 15,937: 28x13
#1188 @ 379,196: 18x21
#1189 @ 337,730: 26x11
#1190 @ 840,256: 16x13
#1191 @ 651,955: 13x13
#1192 @ 174,225: 10x16
#1193 @ 188,212: 27x20
#1194 @ 553,184: 11x10
#1195 @ 504,129: 10x28
#1196 @ 344,568: 10x10
#1197 @ 951,788: 23x22
#1198 @ 212,552: 28x28
#1199 @ 775,577: 26x22
#1200 @ 957,757: 15x29
#1201 @ 56,956: 15x10
#1202 @ 833,931: 16x19
#1203 @ 880,447: 14x23
#1204 @ 430,840: 23x25
#1205 @ 673,641: 14x28
#1206 @ 242,187: 28x18
#1207 @ 757,7: 20x28
#1208 @ 149,450: 12x27
#1209 @ 37,248: 23x20
#1210 @ 335,712: 21x23
#1211 @ 839,767: 27x24
#1212 @ 721,605: 27x15
#1213 @ 611,334: 11x26
#1214 @ 515,933: 25x13
#1215 @ 210,772: 29x10
#1216 @ 492,789: 16x16
#1217 @ 188,82: 24x15
#1218 @ 877,304: 26x14
#1219 @ 829,713: 15x29
#1220 @ 172,510: 23x28
#1221 @ 842,828: 15x23
#1222 @ 88,161: 24x13
#1223 @ 463,290: 13x22
#1224 @ 682,230: 22x12
#1225 @ 713,911: 29x25
#1226 @ 317,157: 26x16
#1227 @ 894,150: 16x28
#1228 @ 906,551: 14x23
#1229 @ 131,562: 23x28
#1230 @ 127,33: 22x23
#1231 @ 134,50: 14x24
#1232 @ 591,409: 12x20
#1233 @ 218,554: 18x26
`.trim()

lines = input.split("\n").map(l => l.trim()).filter(line => line.trim().length > 0)

main()
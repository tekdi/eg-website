const fontFamily =
  localStorage.getItem('lang') === 'hi' ? "'Poppins'" : 'Poppins'
const fontSize = localStorage.getItem('lang') === 'hi' ? '' : ''

let red = {
  50: '#fef2f2',
  100: '#fde5e5',
  150: '#fcd7d7',
  200: '#fbcaca',
  250: '#fabdbd',
  300: '#f9b0b0',
  350: '#f8a3a3',
  400: '#f79595',
  450: '#f68888',
  500: '#f57b7b',
  550: '#dd6f6f',
  600: '#c46262',
  650: '#ac5656',
  700: '#934a4a',
  750: '#7b3e3e',
  800: '#623131',
  850: '#492525',
  900: '#311919',
  950: '#180c0c'
}

let green = {
  50: '#e7f4e8',
  100: '#cfe9d1',
  150: '#b6debb',
  200: '#9ed3a4',
  250: '#86c98d',
  300: '#6ebe76',
  350: '#56b35f',
  400: '#3da849',
  450: '#259d32',
  500: '#0d921b',
  550: '#0c8318',
  600: '#0a7516',
  650: '#096613',
  700: '#085810',
  750: '#07490e',
  800: '#053a0b',
  850: '#042c08',
  900: '#031d05',
  950: '#010f03'
}

// DEFAULT_THEME
const DEFAULT_THEME = {
  fonts: {
    heading: fontFamily,
    body: fontFamily,
    mono: fontFamily
  },
  components: {
    Input: {
      baseStyle: {
        p: '4',
        minH: '45px',
        borderColor: 'Disablecolor',
        borderRadius: '10px'
      }
    },
    Select: {
      baseStyle: {
        p: '4',
        minH: '45px',
        borderColor: 'Disablecolor',
        borderRadius: '10px'
      }
    },
    Text: {
      baseStyle: {
        fontFamily: fontFamily,
        fontSize: fontSize
      }
    },
    Actionsheet: {
      baseStyle: {
        maxW: 1080,
        alignSelf: 'center'
      }
    },
    Button: {
      baseStyle: {
        rounded: 'lg',
        size: 'lg'
      },
      sizes: {
        md: () => ({
          py: 2,
          px: 3,
          _text: {
            fontSize: 'sm'
          },
          _icon: {
            size: 'sm'
          }
        }),
        lg: () => ({
          py: 4,
          px: 3,
          _text: {
            fontSize: 'lg'
          },
          _icon: {
            size: 'lg'
          }
        })
      },
      variants: {
        primary: () => ({
          bg: `#2D142C`,
          _hover: {
            bg: `#555555`
          },
          _pressed: {
            bg: `#444444`
          },
          _text: {
            fontWeight: '600',
            color: '#ffffff'
          },
          rounded: 'full'
        }),
        secondary: () => ({
          bg: `#f2f2f2`,
          _hover: {
            bg: `#e9e9e9`
          },
          _pressed: {
            bg: `#e6e6e6`
          },
          _text: {
            color: `#666666`
          },
          rounded: 'full'
        }),
        outlinePrimary: ({ colorScheme }: any) => ({
          bg: `#2D142C`,
          _hover: {
            bg: `#555555`
          },
          _pressed: {
            bg: `#444444`
          },
          _text: {
            fontWeight: '600',
            color: '#ffffff'
          },
          rounded: 'full'
        }),
        blueOutlineBtn: () => ({
          bg: `#ffffff`,
          borderWidth: '1',
          borderColor: `#084B82`,
          _text: `#084B82`,
          _hover: {
            bg: `#cce2f3`
          },
          _pressed: {
            bg: ``
          },
          rounded: '30px'
        }),
        blueFillButton: () => ({
          bg: `#14242D`,
          borderWidth: '1',
          borderColor: `#14242D`,
          _hover: {
            bg: `#133142`,
            _text: `#14242D`
          },
          _pressed: {
            bg: `#133142`,
            _text: `#14242D`
          },
          rounded: '30px'
        }),
        blueUnderlineButton: () => ({
          bg: `white`,
          borderWidth: '1',
          borderColor: `#084b82`,
          color: '#084b82',
          _text: '#084b82',
          _hover: {
            bg: `#133142`,
            _text: `#14242D`
          },
          _pressed: {
            bg: `#133142`,
            _text: `#14242D`
          },
          rounded: '30px'
        }),
        redOutlineBtn: () => ({
          bg: `#FFFFFF`,
          borderWidth: '1',
          borderColor: `#FF0000`,
          _hover: {
            bg: `#FFFFFF`
          },
          _pressed: {
            bg: `#f9f5f5`
          },
          _text: {
            fontWeight: '700',
            color: '#000000'
          },
          rounded: '4',
          shadow: '2px 3px 0px #8B7171'
        }),
        noOutlineBtn: () => ({
          bg: `#FFFFFF`,
          _hover: {
            bg: `#FFFFFF`
          },
          _pressed: {
            bg: `#f9f5f5`
          },
          _text: {
            fontWeight: '700',
            color: '#000000'
          },
          rounded: '4',
          shadow: '2px 3px 0px #8B7171'
        }),
        greyOutlineBtn: () => ({
          bg: `#FFFFFF`,
          borderWidth: '1',
          borderColor: `#AAAAAA`,
          _hover: {
            bg: `#FFFFFF`
          },
          _pressed: {
            bg: `#f9f5f5`
          },
          _text: {
            fontWeight: '700',
            color: '#000000'
          },
          rounded: '4',
          shadow: '2px 3px 0px #8B7171'
        }),
        statusBtnAdmin: ({ colorScheme }: any) => ({
          bg: `${colorScheme}.50`,
          borderWidth: '1',
          borderColor: `${colorScheme}.500`,
          _hover: {
            bg: `${colorScheme}.100`
          },
          _pressed: {
            bg: `${colorScheme}.200`
          },
          _text: {
            color: `${colorScheme}.500`
          },
          rounded: '100'
        })
      }
    }
  },
  shadows: {
    AlertShadow: {
      shadowColor: '#00000040',
      shadowOffset: {
        width: 2,
        height: 2
      },
      shadowOpacity: 0.5,
      shadowRadius: 5,
      elevation: 0
    },
    BlueOutlineShadow: {
      shadowColor: '#8B7171',
      shadowOffset: {
        width: 1,
        height: 3
      },
      shadowOpacity: 1,
      shadowRadius: 1.0,
      elevation: 1
    },
    BlueFillShadow: {
      shadowColor: '#7BB0FF',
      shadowOffset: {
        width: 1,
        height: 3
      },
      shadowOpacity: 1,
      shadowRadius: 1.0,
      elevation: 1
    },
    SliderCardShadow: {
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 4
      },
      shadowOpacity: 0.4,
      shadowRadius: 4,
      elevation: 0
    },
    FooterShadow: {
      shadowColor: '#E0E0E066',
      shadowOffset: {
        width: 0,
        height: -4
      },
      shadowOpacity: 0.5,
      shadowRadius: 8,
      elevation: 0
    },
    RedFillShadow: {
      shadowColor: '#000000',
      shadowOffset: {
        width: 1,
        height: 3
      },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 0
    },

    RedOutlineShadow: {
      shadowColor: '#000',
      shadowOffset: {
        width: 1,
        height: 3
      },
      shadowOpacity: 1,
      shadowRadius: 1.0,
      elevation: 1
    },

    RedBoxShadow: {
      shadowColor: '#790000',
      shadowOffset: {
        width: 1,
        height: 3
      },
      shadowOpacity: 1,
      shadowRadius: 1.0,
      elevation: 1
    },

    TitleCardShadow: {
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 4
      },
      shadowOpacity: 0.4,
      shadowRadius: 4,
      elevation: 0 // Elevation does not have a direct equivalent in box-shadow, set it as per your requirements
    },

    RedBlackShadow: {
      shadowColor: '#000000',
      shadowOffset: {
        width: 1,
        height: 3
      },
      shadowOpacity: 2,
      shadowRadius: 3,
      elevation: 0,
      borderWidth: 1,
      borderColor: '#FF0000'
    },

    BlueBoxShadow: {
      shadowColor: '#CAE9FF',
      shadowOffset: {
        width: 1,
        height: 3
      },
      shadowOpacity: 1,
      shadowRadius: 1.0,
      elevation: 1
    },
    appBarShadow: {
      shadowColor: '#d9d9d9',
      shadowOffset: {
        width: 0,
        height: 3
      },
      shadowOpacity: 1,
      shadowRadius: 16,
      elevation: 1
    },
    appShadow: {
      shadowColor: '#f1f1f1',
      shadowOffset: {
        width: 0,
        height: 1
      },
      shadowOpacity: 1,
      shadowRadius: `3px 2px`,
      elevation: 1
    },
    BlackOutlineShadow: {
      shadowColor: '#000000',
      shadowOffset: {
        width: 1,
        height: 3
      },
      shadowOpacity: 1,
      shadowRadius: 1.0,
      elevation: 1
    },
    LearnerProfileViewShadow: {
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 4
      },
      shadowOpacity: 0.4,
      shadowRadius: 4,
      elevation: 4
    },
    CardComponentShadow: {
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 4
      },
      shadowOpacity: 0.4,
      shadowRadius: 4,
      elevation: 4
    }
  },
  bg: {
    linearGradient: {
      colors: ['#CAE9FF', '#CAE9FF', '#CAE9FF'],
      start: [0, 0],
      end: [1, 0]
    },
    gradients: 'linear-gradient(360deg, #DC3644 2%, #1F1D76 147%)'
  },

  colors: {
    'eg-blue': {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#1F1D76',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a'
    },
    footer: {
      boxBorder: '#D53546'
    },
    formBg: {
      500: '#FFFFFF'
    },
    inputValueColor: {
      500: '#1F1B13'
    },
    widgetColor: {
      400: '#7F9DAC',
      500: '#DDD8F3',
      600: '#FFE2CC',
      700: '#CCE7FF',
      800: '#C4F2C5',
      900: '#CDDAFD',
      1000: '#FFC6FF'
    },
    viewNotification: {
      500: '#FDDFD8',
      600: '#feefeb',
      700: '#B9FBC0',
      800: '#FDF2EE',
      900: '#AA948E'
    },
    calendarBtncolor: {
      500: '#BCBCBC'
    },
    calendarDatecolor: {
      500: '#BCC1CD'
    },
    selfAicon: {
      500: '#545454'
    },
    iconColor: {
      50: '#0D99FF',
      100: '#616161',
      150: '#696767',
      200: '#757575',
      250: '#FF2815',
      300: '#B3B3B3',
      350: '#AFB1B6',
      400: '#FF2815',
      500: '#aba0db',
      600: '#c3916c',
      700: '#83b0d7',
      800: '#5eb05f',
      900: '#7c8dbc',
      1000: '#ea5fff'
    },
    boxBorderColour: {
      50: '#FFC5C0'
    },
    boxBackgroundColour: {
      50: '#FFC5C0',
      100: '#FAFAFA',
      200: '#cbcaca36'
    },
    studentCard: {
      500: '#B9FBC0',
      800: '#5B7E5F'
    },
    customAlertinfo: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#D6E8FF',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e'
    },
    customAlertdanger: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#FFBEC5',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e'
    },
    successAlert: {
      500: '#B9FBC0'
    },
    warningAlert: {
      500: '#FFE5B3'
    },
    warningAlertText: {
      500: '#373839'
    },
    successAlertText: {
      500: '#0D921B'
    },
    classCard: {
      500: '#D9F0FC',
      900: '#7F9DAC'
    },
    timeTablecellbg: {
      500: '#FFEFEB'
    },
    timeTablecellborder: {
      500: '#FFDFD6'
    },
    timeTablemiddle: {
      500: '#A1D6B6'
    },
    SlickDotsBg: {
      500: '#D2D1FF'
    },
    UploadFileBorder: {
      500: '#B7B7B7'
    },
    floatingLabelColor: {
      500: '#1F1D76'
    },
    inputBorderColor: {
      500: '#7F7667'
    },
    attendanceCard: {
      500: '#C9AFF4',
      600: '#18181b66'
    },
    attendanceCardText: {
      400: '#9C9EA0',
      500: '#373839'
    },
    reportCard: {
      100: '#FFF9F9',
      500: '#FFCAAC',
      800: '#875234'
    },
    present: green,
    presentCardBg: {
      400: '#CEEED1',
      500: '#DFFDE2',
      600: '#cae3ce'
    },
    presentCardCompareBg: {
      500: '#ECFBF2',
      600: '#cae3ce'
    },
    presentCardText: {
      500: '#07C71B'
    },
    presentCardCompareText: {
      500: '#FA8129'
    },
    absent: red,
    absentCardBg: {
      500: '#FDE7E7',
      600: '#dfcbcb'
    },
    absentCardCompareBg: {
      500: '#FFF6F6',
      600: '#dfcbcb'
    },
    absentCardText: red,
    absentCardCompareText: {
      500: '#FA8129'
    },
    special_duty: { 500: '#06D6A0' },
    attendanceSuccessCardCompareBg: {
      500: '#0D921B'
    },
    attendanceWarningCardCompareBg: {
      500: '#FFC369'
    },
    attendanceDangerCardCompareBg: {
      500: '#F57B7B'
    },
    weekCardCompareBg: {
      500: '#FFF8F7'
    },
    worksheetCard: {
      200: '#FEF1F9',
      500: '#F9CCE4',
      800: '#C79AB2',
      900: '#C08FA9'
    },
    worksheetBoxText: {
      400: '#333333',
      500: '#373839'
    },
    reportBoxBg: {
      400: '#FFF8F7',
      500: '#FEF1EE',
      600: '#ede7e6'
    },
    primary: {
      50: '#f2f2f2',
      100: '#d9d9d9',
      200: '#bfbfbf',
      300: '#a6a6a6',
      400: '#8c8c8c',
      500: '#3F8BF1',
      600: '#595959',
      700: '#737373',
      800: '#595959',
      900: '#737373'
    },
    attendancePresent: {
      600: '#2BB639',
      500: '#2BB639'
    },
    attendanceAbsent: red,
    attendanceUnmarked: {
      100: '#F0F0F4',
      300: '#B5B5C8',
      400: '#d3d3e5',
      500: '#C4C4D4',
      600: '#C4C4D4'
    },
    checkBlankcircle: '#FFEB3B',
    attendanceUnmarkedLight: '#F0F0F4',
    attendancedefault: '#d3d3e5',
    timeTableCardOrange: {
      500: '#FFF7F5'
    },
    startIconColor: {
      500: '#FFC326',
      700: '#E78D12'
    },
    timeTableFlashIcon: {
      100: '#BDB3E7',
      200: '#BDB3E7',
      300: '#BDB3E7',
      400: '#BDB3E7',
      500: '#BDB3E7',
      600: '#BDB3E7',
      700: '#BDB3E7',
      800: '#BDB3E7',
      900: '#BDB3E7'
    },
    badgeColor: {
      50: '#FFF0B2',
      400: '#FDE68A',
      450: '#FFEFAF',
      600: '#8F7200'
    },
    progressBarColor: {
      200: '#10B981',
      300: '#A7F3D0'
    },
    progressBarRed: {
      400: '#790000',
      500: '#A7F3D0',
      600: '#790000',
      700: '#A7F3D0',
      800: '#790000',
      900: '#A7F3D0'
    },
    bgGreyColor: {
      200: '#F4F4F7'
    },
    textGreyColor: {
      50: '#9E9E9E',
      100: '#616161',
      200: '#666666',
      250: '#696767',
      150: '#61646B',
      350: '#EAEAEB',
      300: '#888888',
      400: '#F5F5F5',
      450: '#464646',
      500: '#424242',
      550: '#757575',
      600: '#727271',
      650: '#666666',
      700: '#828282',
      750: '#4F4F4F',
      800: '#212121',
      850: '#535353',
      900: '#1E1E1E'
    },
    chipGreyColor: {
      500: '#585858'
    },

    textMaroonColor: {
      50: '#FDCAB5',
      100: '#FFACAF',
      300: '#FF8080',
      350: '#FFE0E1',
      400: '#790000',
      500: '#D53546',
      600: '#FF0000',
      700: '#7c2704',
      800: '#4a1702',
      900: '#190801'
    },
    blueText: {
      200: 'D6E8FF',
      300: '#d4eaf9',
      350: '#CAE9FF',
      400: '#084B82',
      450: '#3F8BF1',
      500: '#0500FF',
      700: '#004AAD'
    },
    bgPinkColor: {
      300: '#F9E9DB'
    },
    bgYellowColor: {
      400: '#FFF5E4'
    },
    editIcon: {
      300: '#3F8BF1'
    },
    sendMessageBtn: {
      200: '#14242D'
    },
    Darkmaroonprimarybutton: {
      400: '#FF0000'
    },
    textBlack: {
      500: '#000000'
    },
    Darkmaroonsecondarybutton: {
      400: '#BDBDBD'
    },
    Disablecolor: {
      400: '#A7A7A7'
    },
    Defaultcolor: {
      400: '#616161'
    },
    Focusedcolor: {
      400: '#3F8BF1'
    },
    Activatedcolor: {
      400: '#757575'
    },
    PrimaryIpcolor: {
      400: '#14242D'
    },
    appliedColor: '#E0E0E0',
    grayColor: '#D3D3D3',
    screenedColor: '#e5f4ff',
    shortlistedColor: '#CAE9FF',
    potentialColor: '#A7F3D0',
    selectedColor: '#A7F3D0',
    successColor: '#00D790',
    underReviewColor: '#FFEFAF',
    rejectedColor: '#FFACAF',
    identifiedColor: '#E0E0E0',
    documentedColor: '#FFEFAF',
    entrolledColor: '#C7DFFF',
    approvedColor: '#A7F3D0',
    droppedoutColor: '#FFACAF',
    duplicatedColor: '#E95055',
    warningColor: '#FFCF52',
    yellowColor: '#FEFFB8',
    dangerColor: '#DC2626',
    infoColor: '#3F8BF1',
    absentColor: '#D53546',
    presentColor: '#038400',

    secondaryBlue: {
      50: '#e7f3fe',
      100: '#b7dcfb',
      200: '#87c5f8',
      300: '#57aef5',
      400: '#2796f2',
      500: '#0d7dd8',
      600: '#0a61a8',
      700: '#074578',
      800: '#042a48',
      900: '#010e18'
    },
    grayInLight: '#9ca3af',
    grayTitleCard: '#484848',
    garyTitleCardBorder: '#DDDDDD',
    grayIndark: '#18181b',
    dashBoardCards: '#F4F4F4',
    btnGray: {
      100: '#e0e0e0'
    },
    footerBorderGray: '#D4D4D4',
    dashboardCardBorder: '#DCDCDC',
    textRed: {
      100: '#ff7b7b',
      200: '#ff5252',
      300: '#FF2815',
      350: '#D53546',
      400: '#ff0000',
      500: '#ff000047'
    },
    dividerColor: '#EEEEEE',
    textGreen: {
      50: '#92eb9b',
      100: '#A6D05F',
      200: '#ABD27B',
      300: '#BCF6DB',
      400: '#232020',
      600: '#488C04',
      700: '#0F6C41'
    },
    SelectBorderColor: {
      500: '#C6C6C6'
    },
    CardComponentBorderColor: {
      500: '#EAEAEA'
    },
    LeanerListCardIDBorder: {
      500: '#676767'
    },
    LearnerListCardNumber: {
      500: '#929292'
    },
    LearnerListCardLink: {
      500: '#0D34FF'
    },
    textBlue: {
      100: '#a8e3fd',
      200: '#0038FF'
    },
    text: {
      100: '#a8e3fd'
    },
    bgRed: {
      500: '#D53546'
    },
    zambezi: '#5A5A5A',
    timeLineBg: '#FFE0E1',
    greenIconColor: '#008C0E',
    whiteSomke: '#F9F9F9'
  }
}

export default DEFAULT_THEME

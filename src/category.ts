enum Category {
    General = 'General',
    Collectibles = 'Collectibles',
    Art = 'Art',
    Photograhpy = 'Photography',
    TradingCards = 'TradingCards',
    Utility = 'Utility',
    Domains = 'Domains'
}

const getCategoryList = (): string[] => {
    return [
        Category.General,
        Category.Collectibles,
        Category.Art,
        Category.Photograhpy,
        Category.TradingCards,
        Category.Utility,
        Category.Domains
    ];
}

export {
    Category,
    getCategoryList
}

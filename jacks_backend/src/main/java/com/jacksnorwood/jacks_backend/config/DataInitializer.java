package com.jacksnorwood.jacks_backend.config;

import com.jacksnorwood.jacks_backend.entity.*;
import com.jacksnorwood.jacks_backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final MenuCategoryRepository menuCategoryRepository;
    private final MenuItemRepository menuItemRepository;
    private final PromotionRepository promotionRepository;
    private final EventRepository eventRepository;
    private final GalleryRepository galleryRepository;
    private final SiteSettingsRepository siteSettingsRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        // Admin user
        if (userRepository.count() == 0) {
            userRepository.save(User.builder()
                    .username("admin").password(passwordEncoder.encode("admin123")).role(Role.ADMIN).build());
            log.info("Admin created: admin / admin123");
        }

        // Menu categories & items
        if (menuCategoryRepository.count() == 0) {
            log.info("Seeding menu categories and items...");

            MenuCategory mainMenu = save(cat("Main Menu", "Our signature mains & classic pub favourites", 1));
            MenuCategory dessert  = save(cat("Dessert",   "Sweet endings to your meal",                   2));
            MenuCategory kidsMenu = save(cat("Kids Menu", "Kid-friendly favourites",                      3));
            MenuCategory drinks   = save(cat("Drinks",    "Craft beers, cocktails, wines & more",         4));

            // --- MAIN MENU / Burgers ---
            item("Classic Beef Burger",       "Angus beef patty, lettuce, tomato, pickles & special sauce on a brioche bun",  "18.99", mainMenu, "Burgers", true,  false, false);
            item("BBQ Bacon Burger",          "Smoky BBQ sauce, crispy bacon, aged cheddar & caramelised onions",              "22.99", mainMenu, "Burgers", true,  false, false);
            item("Crispy Chicken Burger",     "Southern-fried chicken, slaw, pickles & sriracha aioli",                       "21.99", mainMenu, "Burgers", true,  false, false);
            item("Mushroom Veggie Burger",    "Portobello mushroom, roasted capsicum, haloumi & basil pesto",                  "19.99", mainMenu, "Burgers", false, false, true);
            item("Double Smash Burger",       "Two smashed patties, American cheese, grilled onions & burger sauce",           "26.99", mainMenu, "Burgers", false, false, false);

            // --- MAIN MENU / Steaks ---
            item("250g Scotch Fillet",        "Grass-fed scotch fillet with chips, salad & your choice of sauce",              "38.99", mainMenu, "Steaks",  true,  false, false);
            item("300g Ribeye",               "Slow-aged ribeye, bone marrow butter, roasted garlic & seasonal vegetables",    "44.99", mainMenu, "Steaks",  true,  false, false);
            item("400g T-Bone",               "Impressive T-bone, hand-cut chips & peppercorn sauce",                          "48.99", mainMenu, "Steaks",  false, false, false);

            // --- MAIN MENU / Mains ---
            item("Grilled Atlantic Salmon",   "Atlantic salmon, lemon butter, broccolini & herb mash",                        "32.99", mainMenu, "Mains",   true,  false, false);
            item("Chicken Schnitzel",         "Golden crumbed schnitzel with chips, salad & house gravy",                     "23.99", mainMenu, "Mains",   true,  false, false);
            item("Lamb Shank",                "Slow-braised lamb shank, creamy polenta & red wine jus",                       "34.99", mainMenu, "Mains",   false, false, false);
            item("Spaghetti Bolognese",       "Rich slow-cooked meat sauce with fresh herbs over al dente spaghetti",         "19.99", mainMenu, "Mains",   false, false, false);
            item("Barramundi & Chips",        "Beer-battered barramundi, thick-cut chips & house tartare",                    "27.99", mainMenu, "Mains",   false, false, false);

            // --- MAIN MENU / Starters ---
            item("Buffalo Wings (1kg)",       "Crispy wings tossed in spicy buffalo sauce with blue cheese dip",               "22.99", mainMenu, "Starters", true,  true,  false);
            item("Calamari",                  "Golden calamari rings with lemon aioli & mixed leaves",                        "14.99", mainMenu, "Starters", false, false, false);
            item("Garlic Bread",              "Toasted sourdough with house garlic butter & fresh parsley",                    "7.99",  mainMenu, "Starters", false, false, true);
            item("Loaded Nachos",             "House tortilla chips, cheese, jalapeños, guacamole, sour cream & salsa",       "16.99", mainMenu, "Starters", true,  true,  false);
            item("Caesar Salad",              "Baby romaine, parmesan, house croutons & classic Caesar dressing",              "14.99", mainMenu, "Starters", false, false, false);
            item("Soup of the Day",           "Ask your server for today's house-made soup, served with bread",                "10.99", mainMenu, "Starters", false, false, false);

            // --- DESSERT ---
            item("Chocolate Lava Cake",       "Warm dark chocolate fondant with vanilla bean ice cream",                       "10.99", dessert, null, true,  false, false);
            item("Sticky Date Pudding",       "Classic sticky date pudding with butterscotch sauce & cream",                   "9.99",  dessert, null, true,  false, false);
            item("Cheesecake of the Day",     "Ask your server for today's freshly made flavour",                              "9.50",  dessert, null, false, false, false);
            item("Pavlova",                   "House pavlova with seasonal fruit, cream & passionfruit coulis",                "10.50", dessert, null, false, false, false);
            item("Ice Cream (3 Scoops)",      "Choice of vanilla, chocolate or strawberry with waffle cone",                   "7.99",  dessert, null, false, false, false);
            item("Tiramisu",                  "Classic Italian tiramisu with mascarpone & espresso-soaked sponge",             "10.99", dessert, null, false, false, false);

            // --- KIDS MENU ---
            item("Kids Burger & Chips",       "Mini beef burger with golden chips & tomato sauce",                             "10.99", kidsMenu, null, true,  false, false);
            item("Kids Chicken Nuggets",      "Crispy nuggets with chips & tomato sauce",                                     "9.99",  kidsMenu, null, true,  false, false);
            item("Kids Fish & Chips",         "Battered fish bites with chips & tartare sauce",                                "10.50", kidsMenu, null, false, false, false);
            item("Kids Pasta",                "Pasta with butter & parmesan or napoli sauce",                                  "9.50",  kidsMenu, null, false, false, false);
            item("Kids Cheese Pizza",         "Mini cheese pizza on a thin base with tomato sauce",                            "9.99",  kidsMenu, null, false, false, false);
            item("Kids Sausages & Mash",      "Two beef sausages with creamy mash & gravy",                                   "9.99",  kidsMenu, null, false, false, false);

            // --- DRINKS / Beers ---
            item("Coopers Pale Ale (Pint)",   "South Australia's finest — smooth, hoppy & refreshing",                        "8.99",  drinks, "Beers", false, false, false);
            item("Hahn Super Dry (Pint)",     "Light & crisp lager, easy drinking",                                           "7.99",  drinks, "Beers", false, false, false);
            item("Pirate Life IPA (Pint)",    "Locally brewed Adelaide IPA — bold hops & citrus notes",                       "9.99",  drinks, "Beers", true,  false, false);
            item("Guinness (Pint)",           "Classic Irish stout, perfectly poured",                                        "9.99",  drinks, "Beers", false, false, false);
            item("Craft Beer of the Month",   "Ask your server for our rotating local craft selection",                        "10.99", drinks, "Beers", true,  false, false);

            // --- DRINKS / Cocktails ---
            item("Espresso Martini",          "Vodka, Kahlúa, fresh espresso & simple syrup",                                 "18.00", drinks, "Cocktails", true,  false, false);
            item("Aperol Spritz",             "Aperol, prosecco, soda & a slice of orange",                                   "16.00", drinks, "Cocktails", true,  false, false);
            item("Old Fashioned",             "Bourbon, Angostura bitters, orange zest & sugar",                              "18.00", drinks, "Cocktails", false, false, false);
            item("Mojito",                    "White rum, fresh mint, lime, sugar & soda",                                    "16.00", drinks, "Cocktails", false, false, false);
            item("Margarita",                 "Tequila, triple sec, fresh lime & salt rim",                                   "17.00", drinks, "Cocktails", false, false, false);
            item("Cocktail of the Day",       "Ask your server for our house special creation",                                "16.00", drinks, "Cocktails", false, false, false);

            // --- DRINKS / Wines ---
            item("House Red (Glass)",         "Smooth Barossa Valley Shiraz — fruit-forward & medium bodied",                  "10.00", drinks, "Wines", false, false, false);
            item("House White (Glass)",       "Crisp Adelaide Hills Sauvignon Blanc",                                         "10.00", drinks, "Wines", false, false, false);
            item("House Rosé (Glass)",        "Dry McLaren Vale rosé with hints of strawberry & peach",                       "10.00", drinks, "Wines", false, false, false);
            item("Sparkling (Glass)",         "Yalumba Prosecco — light & refreshing",                                        "11.00", drinks, "Wines", false, false, false);

            // --- DRINKS / Soft Drinks ---
            item("Soft Drink (Can)",          "Pepsi, Lemonade, Solo or Soda Water",                                          "4.50",  drinks, "Soft Drinks", false, false, false);
            item("Fresh Orange Juice",        "Freshly squeezed orange juice",                                                 "6.50",  drinks, "Soft Drinks", false, false, false);
            item("Milkshake",                 "Chocolate, vanilla or strawberry — thick & creamy",                            "8.00",  drinks, "Soft Drinks", false, false, false);
            item("Sparkling Water (500ml)",   "San Pellegrino sparkling mineral water",                                        "5.00",  drinks, "Soft Drinks", false, false, false);
            item("Lemon Lime & Bitters",      "Classic Australian pub refresher",                                              "5.50",  drinks, "Soft Drinks", true,  false, false);
        }

        // Promotions
        if (promotionRepository.count() == 0) {
            log.info("Seeding promotions...");
            promotionRepository.save(Promotion.builder().title("Happy Hour")
                    .description("50% off all drinks every day 4–6 PM! Grab a cold one before the rush.")
                    .discount("50% OFF").startDate(LocalDate.now()).endDate(LocalDate.now().plusMonths(3))
                    .active(true).promotionType(PromotionType.DAILY).build());
            promotionRepository.save(Promotion.builder().title("Lunch Special")
                    .description("Any main meal + soft drink for a great value price, available Mon–Fri 11 AM – 3 PM.")
                    .discount("$18.99 Combo").startDate(LocalDate.now()).endDate(LocalDate.now().plusMonths(6))
                    .active(true).promotionType(PromotionType.DAILY).build());
            promotionRepository.save(Promotion.builder().title("Steak Night Thursday")
                    .description("Every Thursday — 250g scotch fillet, chips, salad & a glass of house red or white.")
                    .discount("$35.00").startDate(LocalDate.now()).endDate(LocalDate.now().plusMonths(6))
                    .active(true).promotionType(PromotionType.DAILY).build());
            promotionRepository.save(Promotion.builder().title("Weekend Brunch Special")
                    .description("Free dessert with every main meal on Saturday and Sunday. Treat yourself!")
                    .discount("FREE Dessert").startDate(LocalDate.now()).endDate(LocalDate.now().plusMonths(2))
                    .active(true).promotionType(PromotionType.SPECIAL).build());
            promotionRepository.save(Promotion.builder().title("Family Feast")
                    .description("Feed the whole family! 2 mains, 2 kids meals and a shared dessert for a special price.")
                    .discount("$69.99 Bundle").startDate(LocalDate.now()).endDate(LocalDate.now().plusMonths(3))
                    .active(true).promotionType(PromotionType.SPECIAL).build());
            promotionRepository.save(Promotion.builder().title("Wings Wednesday")
                    .description("1kg buffalo wings + a pint of beer every Wednesday. The perfect midweek treat.")
                    .discount("$29.99").startDate(LocalDate.now()).endDate(LocalDate.now().plusMonths(6))
                    .active(true).promotionType(PromotionType.DAILY).build());
        }

        // Events
        if (eventRepository.count() == 0) {
            log.info("Seeding events...");
            eventRepository.save(Event.builder().title("Live Music Friday")
                    .description("Enjoy live acoustic music every Friday night with our resident local band. No cover charge!")
                    .date(LocalDate.now().plusDays(5)).time(LocalTime.of(20, 0)).active(true).build());
            eventRepository.save(Event.builder().title("NRL Finals Watch Party")
                    .description("Watch the NRL Finals on our giant screens. $5 beers all night long!")
                    .date(LocalDate.now().plusDays(12)).time(LocalTime.of(18, 0)).active(true).build());
            eventRepository.save(Event.builder().title("Thursday Trivia Night")
                    .description("Test your knowledge every Thursday! Prizes for the top 3 teams. Teams of up to 6.")
                    .date(LocalDate.now().plusDays(4)).time(LocalTime.of(19, 0)).active(true).build());
            eventRepository.save(Event.builder().title("Saturday DJ Night")
                    .description("Dance the night away with our resident DJ spinning the best hits all night.")
                    .date(LocalDate.now().plusDays(8)).time(LocalTime.of(21, 0)).active(true).build());
        }

        // Gallery
        if (galleryRepository.count() == 0) {
            log.info("Seeding gallery...");
            String[][] food = {
                {"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800", "Signature Burger"},
                {"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800",    "Fresh Salad"},
                {"https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",    "Grilled Salmon"},
                {"https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=800",    "BBQ Wings"},
            };
            for (int i = 0; i < food.length; i++)
                galleryRepository.save(Gallery.builder().imageUrl(food[i][0]).category("food").caption(food[i][1]).displayOrder(i + 1).build());

            galleryRepository.save(Gallery.builder().imageUrl("https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800").category("drinks").caption("Craft Cocktails").displayOrder(5).build());
            galleryRepository.save(Gallery.builder().imageUrl("https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800").category("drinks").caption("Cold Beers on Tap").displayOrder(6).build());
            galleryRepository.save(Gallery.builder().imageUrl("https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800").category("events").caption("Live Music Night").displayOrder(7).build());
            galleryRepository.save(Gallery.builder().imageUrl("https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?w=800").category("events").caption("Pub Night").displayOrder(8).build());
            galleryRepository.save(Gallery.builder().imageUrl("https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=800").category("interior").caption("Bar Area").displayOrder(9).build());
            galleryRepository.save(Gallery.builder().imageUrl("https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=800").category("interior").caption("Dining Room").displayOrder(10).build());
        }

        // Site settings
        if (siteSettingsRepository.count() == 0) {
            siteSettingsRepository.save(new SiteSettings("social.facebook",  ""));
            siteSettingsRepository.save(new SiteSettings("social.instagram", ""));
            siteSettingsRepository.save(new SiteSettings("social.tiktok",    ""));
        }
    }

    private MenuCategory save(MenuCategory c) { return menuCategoryRepository.save(c); }

    private MenuCategory cat(String name, String desc, int order) {
        return MenuCategory.builder().name(name).description(desc).displayOrder(order).build();
    }

    private void item(String name, String desc, String price, MenuCategory cat,
                      String subcategory, boolean popular, boolean spicy, boolean vegan) {
        menuItemRepository.save(MenuItem.builder()
                .name(name).description(desc).price(new BigDecimal(price))
                .category(cat).subcategory(subcategory)
                .isPopular(popular).isSpicy(spicy).isVegan(vegan).isActive(true).build());
    }
}

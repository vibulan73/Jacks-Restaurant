package com.jacksnorwood.jacks_backend.config;

import com.jacksnorwood.jacks_backend.entity.*;
import com.jacksnorwood.jacks_backend.repository.SiteSettingsRepository;
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
        if (userRepository.count() > 0) return;

        log.info("Seeding initial data...");

        // Admin user
        userRepository.save(User.builder()
                .username("admin").password(passwordEncoder.encode("admin123")).role(Role.ADMIN).build());
        log.info("Admin created: admin / admin123");

        // Categories — Main Menu, Dessert, Kids Menu, Drinks
        MenuCategory mainMenu  = save(cat("Main Menu",  "Our signature mains & classic pub favourites", 1));
        MenuCategory dessert   = save(cat("Dessert",    "Sweet endings to your meal",                   2));
        MenuCategory kidsMenu  = save(cat("Kids Menu",  "Kid-friendly favourites",                      3));
        MenuCategory drinks    = save(cat("Drinks",     "Craft beers, cocktails & soft drinks",         4));

        // Menu items
        saveItem("Classic Burger",         "Beef patty with lettuce, tomato, pickles and special sauce",      "18.99", mainMenu, true,  false, false);
        saveItem("BBQ Bacon Burger",       "Smoky BBQ sauce, crispy bacon, cheddar, caramelised onions",      "22.99", mainMenu, true,  false, false);
        saveItem("Grilled Salmon",         "Atlantic salmon, lemon butter, seasonal vegetables",               "28.99", mainMenu, true,  false, false);
        saveItem("Spaghetti Bolognese",    "Rich meat sauce with fresh herbs over al dente spaghetti",         "19.99", mainMenu, false, false, false);
        saveItem("Buffalo Wings",          "Crispy wings in spicy buffalo sauce with blue cheese dip",         "16.99", mainMenu, true,  true,  false);
        saveItem("Caesar Salad",           "Romaine lettuce, parmesan, croutons, house Caesar dressing",       "12.99", mainMenu, false, false, false);
        saveItem("Chocolate Lava Cake",    "Warm chocolate cake with vanilla bean ice cream",                  "9.99",  dessert,  true,  false, false);
        saveItem("Sticky Date Pudding",    "Classic sticky date pudding with butterscotch sauce",              "8.99",  dessert,  false, false, false);
        saveItem("Cheesecake of the Day",  "Ask your server for today's flavour",                              "8.50",  dessert,  false, false, false);
        saveItem("Kids Burger & Chips",    "Mini beef burger with a side of golden chips",                     "10.99", kidsMenu, true,  false, false);
        saveItem("Kids Chicken Nuggets",   "Crispy chicken nuggets with tomato sauce & chips",                 "9.99",  kidsMenu, true,  false, false);
        saveItem("Kids Pasta",             "Pasta with butter and parmesan or napoli sauce",                   "9.50",  kidsMenu, false, false, false);
        saveItem("Craft Beer (Pint)",      "Rotating local South Australian craft beer selection",             "8.99",  drinks,   false, false, false);
        saveItem("House Cocktail",         "Ask your server for today's special cocktail",                     "16.00", drinks,   false, false, false);
        saveItem("Soft Drink",             "Pepsi, Lemonade, Orange Juice or Soda Water",                     "4.50",  drinks,   false, false, false);

        // Promotions — Daily and Special
        promotionRepository.save(Promotion.builder().title("Happy Hour")
                .description("50% off all drinks every day 4–6 PM! Grab a cold one before the rush.")
                .discount("50% OFF").startDate(LocalDate.now()).endDate(LocalDate.now().plusMonths(3))
                .active(true).promotionType(PromotionType.DAILY).build());
        promotionRepository.save(Promotion.builder().title("Lunch Special")
                .description("Any main meal + soft drink for a great value price, available Mon–Fri 11 AM – 3 PM.")
                .discount("$18.99 Combo").startDate(LocalDate.now()).endDate(LocalDate.now().plusMonths(6))
                .active(true).promotionType(PromotionType.DAILY).build());
        promotionRepository.save(Promotion.builder().title("Weekend Brunch Special")
                .description("Free dessert with every main meal on Saturday and Sunday brunch. Treat yourself!")
                .discount("FREE Dessert").startDate(LocalDate.now()).endDate(LocalDate.now().plusMonths(2))
                .active(true).promotionType(PromotionType.SPECIAL).build());
        promotionRepository.save(Promotion.builder().title("Family Feast")
                .description("Feed the whole family! 2 mains, 2 kids meals and a shared dessert for a special price.")
                .discount("$69.99 Bundle").startDate(LocalDate.now()).endDate(LocalDate.now().plusMonths(3))
                .active(true).promotionType(PromotionType.SPECIAL).build());

        // Events
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

        // Gallery
        String[] foodImgs = {
            "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800",
            "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
            "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=800"
        };
        String[] foodCaps = {"Signature Burger", "Fresh Salad", "Grilled Salmon", "BBQ Wings"};
        for (int i = 0; i < foodImgs.length; i++)
            galleryRepository.save(Gallery.builder().imageUrl(foodImgs[i]).category("food").caption(foodCaps[i]).displayOrder(i+1).build());

        galleryRepository.save(Gallery.builder().imageUrl("https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800").category("drinks").caption("Craft Cocktails").displayOrder(5).build());
        galleryRepository.save(Gallery.builder().imageUrl("https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800").category("drinks").caption("Cold Beers on Tap").displayOrder(6).build());
        galleryRepository.save(Gallery.builder().imageUrl("https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800").category("events").caption("Live Music Night").displayOrder(7).build());
        galleryRepository.save(Gallery.builder().imageUrl("https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?w=800").category("events").caption("Pub Night").displayOrder(8).build());
        galleryRepository.save(Gallery.builder().imageUrl("https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=800").category("interior").caption("Bar Area").displayOrder(9).build());
        galleryRepository.save(Gallery.builder().imageUrl("https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=800").category("interior").caption("Dining Room").displayOrder(10).build());

        // Site settings — social links
        siteSettingsRepository.save(new SiteSettings("social.facebook", ""));
        siteSettingsRepository.save(new SiteSettings("social.instagram", ""));
siteSettingsRepository.save(new SiteSettings("social.tiktok", ""));

        log.info("Seed data loaded successfully.");
    }

    private MenuCategory save(MenuCategory c) { return menuCategoryRepository.save(c); }

    private MenuCategory cat(String name, String desc, int order) {
        return MenuCategory.builder().name(name).description(desc).displayOrder(order).build();
    }

    private void saveItem(String name, String desc, String price, MenuCategory cat,
                          boolean popular, boolean spicy, boolean vegan) {
        menuItemRepository.save(MenuItem.builder()
                .name(name).description(desc).price(new BigDecimal(price))
                .category(cat).isPopular(popular).isSpicy(spicy).isVegan(vegan).isActive(true).build());
    }
}
